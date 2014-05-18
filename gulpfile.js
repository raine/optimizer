var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , livereload = require('gulp-livereload')
  , path = require('path')
;

gulp.task('livereload', function() {
  var lr = livereload(35750);
  var reload = function(file) {
    // stylus middleware compiles the .styl files, so livereload needs to
    // think it was actually a css file that changed, because otherwise it
    // will reload the page instead of just loading the new css.
    // maybe a better option would be compiling stylus with gulp
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
