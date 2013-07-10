var express = require('express');
var fs = require('fs');
var buf = new Buffer(80);

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World! Hallo Welt!');
});

buf = fs.readFile('~index.html');
app.get('/', function(request, response) {
  response.send(buf);
});



var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
