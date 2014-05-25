var express = require('express')
  , logger = require('morgan')
  , http = require('http')
  , multiparty = require('multiparty')
  , _ = require('lodash')
  , Promise = require('bluebird')
  , util = require('util')
  , format = util.format
  , browserify = require('browserify-middleware')
  , livereload = require('connect-livereload')
  , stylus = require('stylus')
  , nib = require('nib')

  , optimize = require('./lib/optimize.js')
;

var app = express();
app.use(logger('dev'));
app.use(livereload({ port: 35750 }));
app.use(stylus.middleware({
  src     : __dirname + '/app/css',
  dest    : __dirname + '/public',
  compile : function(str, path) {
    return stylus(str)
      .set('filename', path)
      // .set('compress', true)
      .use(nib());
  }
}));
app.use(express.static(__dirname + '/public'));

browserify.settings({ transform: ['reactify'] });
app.get('/index.js', browserify('./app/js/index.js'));

var getFile = _.compose(_.first, _.flatten, _.values);

app.post('/optimize', function(req, res) {
  (new multiparty.Form()).parse(req, function(err, fields, filesObj) {
    var file = getFile(filesObj);
    if (file === undefined) return res.send(400);

    var type = file.headers['content-type']
      , filename = file.originalFilename;

    console.log(format('got %s (%s; %d bytes)', filename, type, file.size))
    optimize(file.path, type).then(function(opted) {
      var newSize = opted.file.contents.length;
      console.log(format('%s: optimized and now %d bytes', filename, newSize));
      res.send({
        original_size : file.size,
        new_size      : newSize
      });
    }).error(function(err) {
      console.error('Error:', err);
      res.send({ 'error': err });
    });
  });
});

var server = http.createServer(app);
server.listen(process.env.PORT || 3001, function() {
  console.log('listening at %s', server.address().port);
});

function fail(res) {
  return function(err) {
    console.log('something went wrong:', err);
    res.send(500);
  };
}
