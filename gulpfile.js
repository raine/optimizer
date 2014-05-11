var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , livereload = require('gulp-livereload')
  , path = require('path')
;

gulp.task('livereload', function() {
  var lr = livereload();
  var reload = function(file) {
    if (path.extname(file.path) === '.styl') {
      file.path = __dirname + '/public/main.css';
    }

    lr.changed(file.path);
  };

  gulp.watch([
    'app/**/*.js',
    'app/css/**/*.styl'
  ]).on('change', reload);
});

gulp.task('server', function() {
  nodemon({
    script : 'server.js',
    ext    : 'js',
    env    : { 'NODE_ENV': 'development' },
    ignore : [ './app', 'gulpfile.js' ]
  });
});

gulp.task('default', ['server', 'livereload']);
