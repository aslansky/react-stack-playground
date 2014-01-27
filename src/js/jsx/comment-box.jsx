/** @jsx React.DOM */
'use strict';

var React = require('react');
var CommentList = require('./comment-list');
var CommentForm = require('./comment-form');
var ReactTransitionGroup = React.addons.TransitionGroup;

module.exports = React.createClass({
  handleCommentSubmit: function(comment) {
    this.props.stream.write(JSON.stringify(comment));
  },
  getInitialState: function() {
    return {
      page: this.props.page,
      data: []
    };
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        {this.state.page !== 'write' ? <a className="button" href="#/write">Write comment</a> : ''}
        {this.state.page === 'write' ? <CommentForm onCommentSubmit={this.handleCommentSubmit} /> : ''}
      </div>
    );
  }
});
