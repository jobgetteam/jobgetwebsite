'use strict'

var Promise = require('bluebird')
var mongoose = require('mongoose');
var where = require('node-where');
var Comp = require('./model/company.js')
var Subs = require('./model/subscriber.js')

let atlas_connection_uri = null;
let DEBUG = (process.env['DEBUG']==="true");

function initConnection(context,callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  if(DEBUG) console.log(mongoose.connection);
  if (atlas_connection_uri === null) {
    atlas_connection_uri = process.env['MONGODB_ATLAS_CLUSTER_URI'];
    if (DEBUG) console.log('the Atlas connection string is ' + atlas_connection_uri);
  }
  try {
    if (mongoose.connection.readyState === 0) {
      if (DEBUG) console.log('=> connecting to database');
      mongoose.connect(atlas_connection_uri, {
        useMongoClient: true
      }).then(
      () => callback()
      );
    }else{
      callback();
    }
  } catch (err) {
    console.error('an error occurred', err);
    callback(err);
  }
}

exports.readCompanies = (event, context, callback) => {
  initConnection(context,
    Comp.find({
    },
      function(err, result) {
        if (err !== null) {
          callback(err, {
            statusCode: 500,
            headers: {
              "Access-Control-Allow-Origin": "*" // Required for CORS support to work
            },
            body: JSON.stringify(err)
          });
        } else {
          console.log(result);
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*" // Required for CORS support to work
            },
            body: JSON.stringify(result)
          });
        }
      }
    ))
}

exports.createCompany = (event, context, callback) => {
  var json = event.body;//JSON.parse(event.body);
  if (DEBUG) console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
  Promise.all([Promise.promisify(initConnection)(context), Promise.promisify(where.is)(json.address)])
  .then(function (allData) {
    console.log(allData);
    var whereres = allData[1];
    Comp.create({
        name: json.name,
        email: json.email,
        address: whereres.get('address'),
        location: {
          type: "Point",
          coordinates: [whereres.get('lng'),whereres.get('lat')]
        },
        password: ""
      },
      function(err, result) {
        if (err !== null) {
          callback(err, {
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