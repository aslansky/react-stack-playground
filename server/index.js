'use strict';

var express = require('express');
var path = require('path');
var tinylr = require('tiny-lr');
var shoe = require('shoe');
var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var gutil = require('gulp-util');

module.exports = function(port, lrport) {
  var lr = tinylr();
  lr.listen(lrport);

  var app = express();
  app.use(express.static(path.resolve('./')));

  var sendFile = function (stream) {
    fs.readFile('./comments.json', function (err, buf) {
      gutil.log('Stream write ...');
      stream.write(buf);
    });
  };
  var writeFile = function (data) {
    data = JSON.parse(data);
    fs.readFile('./comments.json', {encoding: 'utf-8'}, function (err, content) {
      content = JSON.parse(content);
      content.push(data);
      fs.writeFile('./comments.json', JSON.stringify(content), {encoding: 'utf-8'});
    });
  };
  var watcher = chokidar.watch('./comments.json');
  var sock = shoe(function (stream) {
    watcher.on('change', function() {
      sendFile(stream);
    });
    stream.on('data', function (data) {
      writeFile(data);
    });
    stream.on('end', function () {
      watcher.close();
    });
    sendFile(stream);
  });

  sock.install(app.listen(port), '/api');
  gutil.log('Listening on', port + ' / ' + lrport);

  return {
    lr: lr,
    app: app
  };
};
