/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Comment = require('./comment');
var ReactTransitionGroup = React.addons.TransitionGroup;

module.exports = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment, i) {
      return <Comment key={i} author={comment.author}>{comment.text}</Comment>;
    });
    return (
      <ReactTransitionGroup transitionName="comment">
        {commentNodes}
      </ReactTransitionGroup>
    );
  }
});
