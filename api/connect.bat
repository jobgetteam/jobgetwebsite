lambda-local -l app.js -e event.json -E '{\"MONGODB_ATLAS_CLUSTER_URI\":\"mongodb://lambdauser:lambdapass@cluster0-shard-00-00-wwwhr.mongodb.net:27017,cluster0-shard-00-01-wwwhr.mongodb.net:27017,cluster0-shard-00-02-wwwhr.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin\"}'