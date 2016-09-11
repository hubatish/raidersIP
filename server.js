// Zach Howell Node Server
//

var express = require('express');
var app = express(); //made an app!
var bodyParser = require('body-parser');

// configuring to let us get data from POST
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// process.env.PORT no idea what does, didn't access open aws port
var port = process.env.PORT || 8241;

var router = require('./routes.js');
app.use('/',router);

app.listen(port);
console.log("Server running at port "+port);

