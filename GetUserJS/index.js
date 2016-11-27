
"use strict";

var DocumentClient = require('documentdb').DocumentClient;
var config         = require('config');
var DBUtils        = require('DBUtils');

module.exports = function (context, req) {
    
    // check if the request is properly formatted
    if (!(req.query.nickname || (req.body && req.body.nickname))) {
        var res = {};
        res.status = 400;
        res.body   = "Not properly formatted request";
        context.done(null, res);
    }
    
    // req body contains nickname for the request
    var nickname = req.query.nickname || req.body.nickname;
    
    // general definitions for the db linking
    var databaseUrl     = `dbs/${config.database.id}`;
    var collectionUrl   = databaseUrl + '/colls/' + config.collection.users;
    // retrieving client for documentDB
    var client = new DocumentClient(config.endpoint, { masterKey: config.primaryKey });
    
    // performing the request
    DBUtils.getDocumentFromUsers(client, collectionUrl, nickname, function(err, results) { 
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