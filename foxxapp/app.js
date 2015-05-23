(function() {
  "use strict";
  var db = require("internal").db;
  var joi = require("joi");
  var Foxx = require("org/arangodb/foxx");
  var app = new Foxx.Controller(applicationContext);

  /** Recommend
   *
   * Get recommendation for person
   */
  app.get("/products/:id", function(req, res) {
    var id = "Users/" + req.params("id");
    require("console").log(id);
    var result = db._query(
      "FOR x IN GRAPH_NEIGHBORS('ecom', @id, {direction: 'outbound', minDepth: 2, maxDepth: 2}) RETURN x.vertex",
      {id: id }
    ).toArray();
    res.json(result);
    }).pathParam("id", {type: joi.string().required().description("user id")});
}());
