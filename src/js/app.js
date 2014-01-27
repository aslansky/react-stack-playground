'use strict';

var React = require('react');
var director = require('director');
var CommentBox = require('./jsx/comment-box');
var router = director.Router().init();
var shoe = require('shoe');
var stream = shoe('/api');

var app = React.renderComponent(
  CommentBox({
    stream: stream,
    page: router.getRoute(0)
  }),
  document.getElementById('content')
);

stream.on('data', function (data) {
  app.setState({data: JSON.parse(data)});
});

router.on('/:state', function (page) {
  app.setState({page: page});
});
