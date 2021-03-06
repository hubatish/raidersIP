// Zach Howell Node Server
//
// Tutorial started from here:
// https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

var express = require('express');
var app = express(); //made an app!
var bodyParser = require('body-parser');

// configuring to let us get data from POST
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 8241;

var router = require('./routes.js');
app.use('/',router);

app.listen(port);
console.log("Server running at port "+port);

