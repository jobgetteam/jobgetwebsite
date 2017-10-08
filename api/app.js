'use strict'

var async = require('asyncawait/async');
var await = require('asyncawait/await');
var Promise = require('bluebird')
var mongoose = require('mongoose')
mongoose.Promise = Promise;
var where = require('node-where')
var Comp = require('./model/company.js')
var Subs = require('./model/subscriber.js')
const AWS = require('aws-sdk')

let atlas_connection_uri = null;
let ONLINE = process.env['ONLINE'];
let DEBUG = (process.env['DEBUG']==="true");

var initConnection = async (function (context,callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  var uri=process.env['MONGODB_ATLAS_CLUSTER_URI'];

  if(DEBUG) console.log(mongoose.connection);
  if (atlas_connection_uri === null) {
    if(ONLINE){
      const kms = new AWS.KMS();
        atlas_connection_uri = await (kms.decrypt({ CiphertextBlob: new Buffer(uri, 'base64') }).promise()).Plaintext.toString('ascii');
    }else{
      atlas_connection_uri=uri;
    }
  }
  if(DEBUG) console.log(atlas_connection_uri)
  try {
    if (mongoose.connection.readyState === 0) {
      if (DEBUG) console.log('=> connecting to database');
      await (mongoose.connect(atlas_connection_uri, {
        useMongoClient: true
      }));
    }
    callback();
  } catch (err) {
    console.error('an error occurred', err);
    callback(err);
  }
})

function getBody(event){
  if(ONLINE) return JSON.parse(event.body);
  else return event.body;
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
  if (DEBUG) console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
  if(DEBUG) console.log(atlas_connection_uri);
    var json=getBody(event);
    if(DEBUG) console.log(json)
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
    var json=getBody(event);
    if(DEBUG) console.log(json);
    Subs.create({
        name: json.name,
        email: json.email,
        address: json.address,
        password: ""
      },
      function(err, result) {
        if (err !== null) {
          if (DEBUG) console.error("an error occurred in createSubscriber", err);
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