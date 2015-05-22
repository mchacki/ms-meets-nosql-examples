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
      // Ask the ArangoDB Foxx App directly.
      request('http://127.0.0.1:9000/arangodb/products/' + id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          reply(body);
        } else {
          reply({error: error});
        }
      });
    }
  });


  server.start(function () {
    console.log("Product Recommonder Server running at:", server.info.uri);
  });
}());

