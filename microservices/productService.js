(function() {
  "use strict";
  var Hapi = require('hapi');
  var request = require('request');
  var http = require('http');
  var port = -1;
  for (var i = 2; i < process.argv.length; i += 2) {
    if (process.argv[i] === "-p") {
      port = parseInt(process.argv[i+1]);
    }
  }

  if (port === -1) {
    console.log("Has to define a port with -p XXXX");
    return;
  }

  var server = new Hapi.Server();
  server.connection({ host: "localhost", port: port });

  // Offer a route to get all products recommended for the user with a given ID
  server.route({
    method: "GET",
    path: "/products/{id}",
    handler: function (req, reply) {
      var id  = req.params.id;
      // Ask the Neo4J instance for the recommended product IDs
      http.request({
        method: "GET",
        host: "127.0.0.1",
        port: 9000,
        path: "/neo4j/recommended/" + id
      }, function(res) {
        res.on("data", function (body) {
          // Ask the MongoDB instance about the actual information of the products
          var ids = JSON.parse(body);
          http.request({
            method: "POST",
            host: "127.0.0.1",
            port: 9000,
            path: "/mongo/products",
            headers: {"Content-Length": body.length}
          }, function(res) {
            res.on("data", function(body) {
              reply(body.toString());
            });
          }).end(body);
        });
      
      }).end();
    }
  });

  server.start(function () {
    console.log("Product Recommonder Server running at:", server.info.uri);
  });
}());

