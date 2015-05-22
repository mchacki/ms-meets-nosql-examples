# ms-meets-nosql-examples
This is the repository for the code examples shown in my Microservices meets NoSQL Talk

## Run it yourself

1. After checking out the repository install all node dependencies using `npm install`
2. For the database part you need to install the following databases in their default configuration, please follow their instructions:
  1. [Arangodb](www.arangodb.com) 
  2. [Mongodb](www.mongodb.com) 
  3. [Neo4J](www.neo4j.com) in neo.js please adjust username/password
3. Deploy the Foxx App to arangodb with `foxx-manager install foxxapp /arangodb`
4. Install [HAProxy](http://www.haproxy.org)
5. Start HAProxy with `haproxy -f haproxy.cfg`. If you want to modify the config and reload it use `haproxy -f haproxy.cfg -st $(<haproxy.pid)`.
6. Fire up all node processes:
```
node app.js -p 3000 &
node cpuService.js -p 3001 &
node cpuService.js -p 3002 &
node cpuService.js -p 3003 &
node cpuService.js -p 3004 &
node memService.js -p 3005 &
node productService.js -p 4000 &
node productServiceArango.js -p 4001 &
node neo.js -p 4002 &
node mongo.js -p 4003 &
```

Now you have the microservices running.
The first route available to you is `http://localhost:9000/app` for the micro-service only example. Try to replace app.js with monolith.js here. The behaviour is identical, but monolith is harder to scale.
The other route available to you is `http://localhost:9000/products/{id}`. This one switches between ArangoDB and MongoDB & Neo4J setup. You can notice the difference by the printed internal ids.

## Example Data

**Disclaimer:** This dataset is neither meant to represent any real world use case, nor did i introduce any indexing in the databases. It is only a simple showcase to transport my idea.

### MongoDB

Connect to MongoDB with the mongo shell and execute the followng commands:

```
unix> mongo

db.createCollection("products");
db.products.save({id: "098", item: "Product1"})
db.products.save({id: "765", item: "Product2"})
db.products.save({id: "432", item: "Product3"})

db.createCollection("users");
db.users.save({id: "123", name: "Alice"})
db.users.save({id: "456", name: "Bob"})
db.users.save({id: "789", name: "Charly"})
```

### Neo4J

Connect to Neo4J's webinterface at `http://localhost:7474`
There execute the following cypher statement:

```
CREATE p = (p1:Product {id: "098"})<-[:Bought]-(f1:Users {id: "456"})<-[:Friend]-(me:Users {id: "123"})-[:Friend]->(f2:Users {id: "789"})-[:Bought]->(p2:Product {id: "765"})
RETURN p
```

### ArangoDB

Connect to ArangoDB with arangosh (the arangodb shell) and execute the following statements:

```
unix> arangosh

db._create("Products");
db.Products.save({_key: "098", item: "Product1"})
db.Products.save({_key: "765", item: "Product2"})
db.Products.save({_key: "432", item: "Product3"})

db._create("Users");
db.Users.save({_key: "123", name: "Alice"})
db.Users.save({_key: "456", name: "Bob"})
db.Users.save({_key: "789", name: "Charly"})

db._createEdgeCollection("relations");
db.relations.save("Users/123", "Users/456", {});
db.relations.save("Users/123", "Users/789", {});
db.relations.save("Users/456", "Products/098", {});
db.relations.save("Users/456", "Products/765", {});
```
