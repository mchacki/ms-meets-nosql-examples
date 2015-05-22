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

  var server = new Hapi.Server();
  server.connection({ host: "localhost", port: port });

  // Define the route /app as the only entry to this application
  server.route({
    method: "GET",
    path: "/app",
    handler: function (req, reply) {
      // Use CPU remotly
      request('http://127.0.0.1:9000/cpu', function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // Use RAM remotly
          request('http://127.0.0.1:9000/mem/' + body, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              reply(body);
            } else {
              reply({error: error});
            }
          });
        } else {
          reply({error: error});
        }
      });
    }
  });


  server.start(function () {
    console.log("App Server running at:", server.info.uri);
  });
}());

