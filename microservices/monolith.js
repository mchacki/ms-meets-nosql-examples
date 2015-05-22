(function() {
  "use strict";
  var Hapi = require('hapi');
  var request = require('request');
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

  // Define the route /app as the only entry to this application
  server.route({
    method: "GET",
    path: "/app",
    handler: function (req, reply) {
      // Use CPU locally
      var sum = cpuWaste();
      // Use RAM locally
      reply(dataLookup["key" + sum]);
    }
  });


  server.start(function () {
    console.log("App Server running at:", server.info.uri);
  });
}());

