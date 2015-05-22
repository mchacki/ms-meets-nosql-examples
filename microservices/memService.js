(function() {
  "use strict";
  var Hapi = require('hapi');
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

  var dataLookup = {};

  for (var j = 0; j < 500000; ++j) {
    dataLookup["key" + j] = "This is test text number " + j + ".";
  }

  var server = new Hapi.Server();
  server.connection({ host: "localhost", port: port });

  // Offer a route to access the data in this service
  server.route({
    method: "GET",
    path: "/mem/{id}",
    handler: function (request, reply) {
      reply(dataLookup["key" + request.params.id]);
    }
  });


  server.start(function () {
    console.log("Memory bound Server running at:", server.info.uri);
  });
}());
