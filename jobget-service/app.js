'use strict'

//var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Comp = require('./company')
var Subs = require('./subscriber')

let atlas_connection_uri = null;
let DEBUG = process.env['DEBUG'];

function initConnection(context,insertObject) {
  context.callbackWaitsForEmptyEventLoop = false;
  if (atlas_connection_uri === null) {
    atlas_connection_uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
    if (DEBUG) console.log('the Atlas connection string is ' + atlas_connection_uri);
  }
  try {
    if (mongoose.connection.readyState === 0) {
      if (DEBUG) console.log('=> connecting to database');
      mongoose.connect(atlas_connection_uri, {
        useMongoClient: true
      }).then(function(err, db) {
        if (DEBUG) console.log(err);
        insertObject();
      });
    }else{
      insertObject();
    }
  } catch (err) {
    console.error('an error occurred', err);
  }
}

exports.createCompany = (event, context, callback) => {
  if (DEBUG) console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
  initConnection(context, function() {
    var json = JSON.parse(event.body);
    Comp.create({
        name: json.name,
        email: json.email,
        address: json.address,
        password: ""
      },
      function(err, result) {
        if (err !== null) {
          if (DEBUG) console.error("an error occurred in createDoc", err);
          callback(null, {
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*" // Required for CORS support to work
            },
            body: JSON.stringify(err)
          });
        } else {
          console.log(result);
          callback(null, {
            statusCode: 201,
            headers: {
              "Access-Control-Allow-Origin": "*" // Required for CORS support to work
            },
            body: JSON.stringify(result)
          });
        }
      }
    );
  });
}

exports.createSubscriber = (event, context, callback) => {
  if (DEBUG) console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
  initConnection(context, function() {
    var json = JSON.parse(event.body);
    Subs.create({
        name: json.name,
        email: json.email,
        address: json.address,
        password: ""
      },
      function(err, result) {
        if (err !== null) {
          if (DEBUG) console.error("an error occurred in createDoc", err);
          callback(null, {
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*" // Required for CORS support to work
            },
            body: JSON.stringify(err)
          });
        } else {
          console.log(result);
          callback(null, {
            statusCode: 201,
            headers: {
              "Access-Control-Allow-Origin": "*" // Required for CORS support to work
            },
            body: JSON.stringify(result)
          });
        }
      }
    );
  });
}