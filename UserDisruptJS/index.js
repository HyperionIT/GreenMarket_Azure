
"use strict";

var DocumentClient = require('documentdb').DocumentClient;
var config         = require('config');
var DBUtils        = require('DBUtils');

module.exports = function (context, req) {
    
    // check if the request is properly formatted
    if (!(req.body && req.body.disrupt)) {
        var res = {};
        res.status = 400;
        res.body   = "Not properly formatted request";
        context.done(null, res);
    }
    
    // req body contains disrupt 
    var disrupt = req.body.disrupt;
    
    // general definitions for the db linking
    var databaseUrl             = `dbs/${config.database.id}`;
    var collectionUrlProduct   = databaseUrl + '/colls/' + config.collection.products;
    var collectionUrlUser      = databaseUrl + '/colls/' + config.collection.users;
    
    // retrieving client for documentDB
    var client = new DocumentClient(config.endpoint, { masterKey: config.primaryKey });
    
    // performing the request
    DBUtils.performDisrupt(client, collectionUrlProduct, collectionUrlUser, 
                           disrupt.productBarcode, 
                           disrupt.nickname, 
                           disrupt.like, 
                           function(err, results) { 
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
                            }
    );
}