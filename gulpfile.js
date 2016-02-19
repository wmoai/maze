const gulp = require('gulp')
, browserify = require('browserify')
, fs = require('fs')
, source = require('vinyl-source-stream')
, buffer = require('vinyl-buffer')
, uglify = require('gulp-uglify')
;

gulp.task('browserify', () => {
  browserify('./public/js/src/game.js')
  .transform('babelify', {presets: ['es2015', 'react']})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./public/js/build/'));
});

gulp.task('watch', () => {
  gulp.watch('./public/js/src/**/*.js', ['browserify']);
});

gulp.task('default', ['watch', 'browserify']);
