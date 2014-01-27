# [gulp](http://gulpjs.com/), [browserify](http://browserify.org/), [node-sass](https://github.com/andrew/node-sass)/[Bourbon](http://bourbon.io/), [React](http://facebook.github.io/react/index.html) and [shoe](https://github.com/substack/shoe) playground

## Why?

I wanted to play with some newer stuff. So I decided to have a look at the "newest" contenders in the web dev playground.

## What?

* [gulp](http://gulpjs.com/) the streaming task runner for node. Previously I used [grunt](http://gruntjs.com/) and it is great. But there is one problem ... it gets really slow with bigger problems. Especially in combination with [sass](http://sass-lang.com/)/[compass](http://compass-style.org/).
* [browserify](http://browserify.org/) allows you to use node.js-style requires in the browser and [npm](https://npmjs.org/) as the package manager. For me it is easier to use than [require.js](http://requirejs.org/) because of a much simpler configuration.
* [node-sass](https://github.com/andrew/node-sass) uses [libSass](http://libsass.org/) to process sass/scss files into css. Because it is written in node.js and uses the c bindings it is much faster than the ruby [sass](http://sass-lang.com/) executable.
* [Bourbon](http://bourbon.io/) is a mixing library for sass which is much simpler and more lightweight than [compass](http://compass-style.org/) but also has the most stuff I need.
* [React](http://facebook.github.io/react/index.html) is a library for building user interfaces that uses a virtual DOM diff implementation for higher performance.
* [shoe](https://github.com/substack/shoe) is a library to use streams over [sockjs](https://github.com/sockjs/sockjs-node). I used it to replace ajax request. Just for fun ...

## Source code

You can find the source code on [github](https://github.com/aslansky/react-stack-playground).

## Learnings

* [gulp](http://gulpjs.com/) is great. The one thing that makes it more useful than grunt for me is the configuration that is done in pure javascript. No ~~obscure~~ complex configuration object like in grunt. To define a task you just need to create code like this:

  ```
  gulp.task('styles', function () {
    return gulp.src('./src/scss/main.scss')
      .pipe(sass({
        outputStyle: gulp.env.production ? 'compressed' : 'expanded',
        includePaths: ['./src/scss'].concat(bourbon),
        errLogToConsole: gulp.env.watch
      }))
      .pipe(gulp.dest('./dist/css'));
  });
  ```
  Also because of the use of streams gulp seems to be much faster than grunt. The only upside I could see at the time is the lack of plugins. The grunt ecosystem of plugin is bigger and more mature.
  You can find more on grunt vs gulp [here](http://www.shaundunne.com/gulp-is-the-new-black/).

 * [browserify](http://browserify.org/) is awesome. Together with npm you get a nice package management system that just works without much configuration. Also the use of module.exports and require in a node.js way for me looks cleaner than the amd syntax of [require.js](http://requirejs.org/). To get started you just need to have a package.json and a task in your gulpfile.js

   ```
   "dependencies": {
     "react": "~0.8.0",
     "showdown": "aslansky/showdown",
     "shoe": "0.0.15"
   }
   ```
   ```
   gulp.task('scripts', function() {
     return gulp.src('./src/js/app.js', {read: false})
       .pipe(browserify({
         insertGlobals : false,
         transform: ['reactify'],
         extensions: ['.jsx'],
         debug: !gulp.env.production
       }))
       .pipe(gulpif(gulp.env.production, uglify({
         mangle: {
           except: ['require', 'export', '$super']
         }
       })))
       .pipe(gulp.dest('./dist/js'));
   });
   ```
   After that you can start using require in your javascript.

   ```
   var React = require('react');
   var CommentBox = require('./jsx/comment-box');
   ```
   or write modules with module.exports

   ```
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
   ```

 * with [node-sass](https://github.com/andrew/node-sass) and without the need for installing any ruby dependencies your project can stay in plain javascript. So no extra installations needed. Also node-sass seems to process scss files much faster then ruby sass. The downside of node-sass that not all mixins or mixin libries are compatible. Especially [compass](http://compass-style.org/) doesn't work with it.

 * [Bourbon](http://bourbon.io/) is a neat little mixin library for sass that is compatible with node-sass. It has all the features I need. In my view the documentation is better than compass' and with [Bourbon Neat](http://neat.bourbon.io/) it also has a nice grid framework. Because Bourbon is plain scss there are no compatibility issues between versions like I had to experience with ruby sass and compass.

 * I chose to just play with React's [Tutorial](http://facebook.github.io/react/docs/tutorial.html) implementation of a comment box. The use of components makes the code really readable and with JSX there is a easy to understand syntax for templating. You don't need to use JSX but it makes the source code of the components even more understandable. For example the comment form looks like this:

   ```
   /** @jsx React.DOM */
   'use strict';

   var React = require('react');

   module.exports = React.createClass({
     handleSubmit: function() {
       var author = this.refs.author.getDOMNode().value.trim();
       var text = this.refs.text.getDOMNode().value.trim();
       this.props.onCommentSubmit({author: author, text: text});
       this.refs.author.getDOMNode().value = '';
       this.refs.text.getDOMNode().value = '';
       return false;
     },
     render: function() {
       return (
         <div className="commentForm">
           <form className="commentForm" onSubmit={this.handleSubmit}>
             <input type="text" placeholder="Your name" ref="author" />
             <textarea placeholder="Say something..." ref="text"></textarea>
             <button type="submit">Post</button>
           </form>
         </div>
       );
     }
   });
   ```

* Because I wanted to use Websockets instead of ajax with the react tutorial and all the new information I got about streams by using gulp, I decided to use [shoe](https://github.com/substack/shoe). The browser implementation is straight forward. Open a stream to the server an then wait for data to come. If you want to send data to the server, just write to the stream.

   ```
   var stream = shoe('/comments');
   this.stream.on('data', function (data) {
     this.setState({data: JSON.parse(data)});
   });
   this.stream.write(JSON.stringify(comment));
   ```
   If you want to know more about the server side have a look [here](https://github.com/aslansky/react-stack-playground/blob/master/server/index.js). The [shoe documentation](https://github.com/substack/shoe) also has some nice examples.

## Conclusion

First of all, it is fun to play with new things. You should try it sometimes. Second, the experience was great. All the libraries and tools work nice together and I can imagine building a web application with this stack. The next thing I want to look into, is how to combine [director](https://github.com/flatiron/director) with React to have a router for a single page site.
