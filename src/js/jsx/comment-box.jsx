/** @jsx React.DOM */
'use strict';

var React = require('react');
var CommentList = require('./comment-list');
var CommentForm = require('./comment-form');
var shoe = require('shoe');

module.exports = React.createClass({
  loadCommentsFromServer: function() {
    this.stream.on('data', function (data) {
      this.setState({data: JSON.parse(data)});
    }.bind(this));
  },
  handleCommentSubmit: function(comment) {
    this.stream.write(JSON.stringify(comment));
  },
  getInitialState: function() {
    return {data: []};
  },
  componentWillMount: function() {
    this.stream = shoe('/comments');
    this.loadCommentsFromServer();
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});
