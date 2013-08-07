//var express = require('../node-js-sample/node_modules/express');
var express = require('express');
var app = express.createServer(express.logger());

var fs = require('fs');
//var buf = new Buffer(10000);

//buf = fs.readFileSync('index.html');
// console.log(buf.toString());


app.get('/', function(request, response) {
//  response.send(buf.toString('utf-8'));
    var html = fs.readFileSync('index.html').toString();
    response.send(html);
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});

