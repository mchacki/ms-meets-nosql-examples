(function() {
  "use strict";
  var Hapi = require('hapi');
  var neo4j = require('seraph')({
    user: 'neo4j',
    pass: 'neo4j'
  });

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

  // Offer a route to get ids known to MongoDB from the graph query.
  server.route({
    method: "GET",
    path: "/neo4j/recommended/{id}",
    handler: function (req, reply) {
      neo4j.query('MATCH (me:Users {id: "' + req.params.id + '"}) -[:Friend]-> (:Users)-[:Bought]-> (p) return p.id as id',
        function (err, result) {
          if (err) return reply(err);
          reply(result);
        }
      );
    }
  });

  server.start(function () {
    console.log("Neo4j Server running at:", server.info.uri);
  });

}());
