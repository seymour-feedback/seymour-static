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

gulp.task('watch', function() {
  gulp.watch([paths.inPath], ['bundleJS']);
});

gulp.task('default', ['js', 'watch']);
