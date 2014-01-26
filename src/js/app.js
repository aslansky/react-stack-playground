'use strict';

var React = require('react');
var CommentBox = require('./jsx/comment-box');

React.renderComponent(
  CommentBox({
    url: 'comments.json',
    pollInterval: 2000
  }),
  document.getElementById('content')
);
