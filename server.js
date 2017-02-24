/*eslint-env node, express*/
/** 
* Created by http://myeonguni.com on 2016-09-02. 
*/ 
  
var express = require('express'); 
var app = express(); 
var bodyParser = require('body-parser'); 
var session = require('express-session'); 
var fs = require("fs") ;

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
  
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded()); 
app.use(session({ 
secret: 'zhJ5Ia4X598Y6PEd2hBVeZQC8TA', 
resave: false, 
saveUninitialized: true 
})); 
   
  
var router = require('./router/main')(app, fs); 
