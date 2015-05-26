'use strict';

var gulp = require('gulp'),
  browserify = require('gulp-browserify'),
  paths = {
    inPath:  'js/app.js',
    outPath: './dist'
  };

gulp.task('js', function () {
  gulp.src(paths.inPath)
    .pipe(browserify({
      insertGlobals: true,
      compress: true
    }))
    .pipe(gulp.dest(paths.outPath));
});

gulp.task('default', ['js']);
