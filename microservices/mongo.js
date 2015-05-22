(function() {
  "use strict";
  var Hapi = require('hapi');
  var MongoClient = require('mongodb').MongoClient;
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

  MongoClient.connect('mongodb://127.0.0.1:27017/test', {
    server: {
      auto_reconnect: true,
      poolSize: 5,
      socketOptions: {keepAlive: 1}
    }
  }, function (err, db) {
    if (err) return console.log(err);
    var products = db.collection('products');

    var server = new Hapi.Server();
    server.connection({ host: "localhost", port: port });

    // Offer a route to extract a list of documents by their id.
    server.route({
      method: "POST",
      path: "/mongo/products",
      handler: function (req, reply) {
        // Body is of type [id: <idstring>]
        products.find({$or: req.payload}).toArray(function(err, result) {
          if (err) return reply(err);
          console.log(result);
          reply(result);
        });
      }
    });

    server.start(function () {
      console.log("Mongodb Server running at:", server.info.uri);
    });
  });
}());
