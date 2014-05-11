var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , livereload = require('gulp-livereload')
;

gulp.task('livereload', function() {
  var lr = livereload();
  var reload = function(file) {
    lr.changed(file.path);
  };

  gulp.watch([
    'app/**/*.js'
    // 'static/editor/{main,/lib/**/*,/vendor/*}.js',
    // 'static/{*.css,*.html,javascripts/*.js}'
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
