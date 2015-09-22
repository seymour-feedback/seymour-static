'use strict';

var gulp = require('gulp'),
  browserify = require('gulp-browserify'),
  paths = {
    inPath:  'src/js/app.js',
    outPath: 'public/js/'
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
