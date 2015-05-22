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

  var cpuWaste = function() {
    var sum = Math.floor(Math.random() * 10000);
    for (var j = 0; j < 1000000; ++j) {
      sum += j;
      sum %= 10000;
    }
    return sum;
  };

  var server = new Hapi.Server();
  server.connection({ host: "localhost", port: port });

  // Offer a route to waste the CPU on this Service
  server.route({
    method: "GET",
    path: "/cpu",
    handler: function (request, reply) {
      reply(cpuWaste());
    }
  });

  server.start(function () {
    console.log("CPU bound server running at:", server.info.uri);
  });
}());
