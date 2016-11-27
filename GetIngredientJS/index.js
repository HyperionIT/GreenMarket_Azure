
"use strict";

var DocumentClient = require('documentdb').DocumentClient;
var config         = require('config');
var DBUtils        = require('DBUtils');

module.exports = function (context, req) {
    
    // check if the request is properly formatted
    if (!(req.query.ingredient || (req.body && req.body.ingredient))) {
        var res = {};
        res.status = 400;
        res.body   = "Not properly formatted request";
        context.done(null, res);
    }
    
    // req body contains ingredient code for the request
    var ingredient = req.query.ingredient || req.body.ingredient;
    
    // general definitions for the db linking
    var databaseUrl     = `dbs/${config.database.id}`;
    var collectionUrl   = databaseUrl + '/colls/' + config.collection.ingredients;
    // retrieving client for documentDB
    var client = new DocumentClient(config.endpoint, { masterKey: config.primaryKey });
    
    // performing the request
    DBUtils.getDocumentFromIngredients(client, collectionUrl, ingredient, function(err, results) { 
      var res = {};
      // check for results 
      if (err !== null || results === null) {
          res.status = 400;
          res.body   = "No document found or an internal error occured";
      } else {
          res.status = 200;
          res.body   = results;
      }
      
      // returning results 
      context.done(null, res);
    });
}