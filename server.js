'use strict';

var express = require('express'),
  app = express(),
  server;

app.use(express.static(__dirname + '/'));

server = app.listen(3008, function() {
  console.log('Listening on port %d', server.address().port);
});
