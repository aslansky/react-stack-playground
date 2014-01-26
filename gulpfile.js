'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var server = require('./server');
var bourbon = require('node-bourbon').includePaths;

gutil.log('Environment', gutil.colors.blue(gulp.env.production ? 'Production' : 'Development'));

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

gulp.task('styles', function () {
  return gulp.src('./src/scss/main.scss')
    .pipe(sass({
      outputStyle: gulp.env.production ? 'compressed' : 'expanded',
      includePaths: ['./src/scss'].concat(bourbon),
      errLogToConsole: gulp.env.watch
    }))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', function() {
  gulp.env.watch = true;
  var servers = server(8080, 35729);

  // Watch files and run tasks if they change
  gulp.watch('./src/js/**', function(evt) {
    gulp.run('scripts', function () {
      servers.lr.changed({body: {files: [evt.path]}});
    });
  });

  gulp.watch('src/scss/**', function(evt) {
    gulp.run('styles', function () {
      servers.lr.changed({body: {files: [evt.path]}});
    });
  });
});

gulp.task('build', ['styles', 'scripts']);
