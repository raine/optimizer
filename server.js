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

  , optimize = require('./lib/optimize.js')
;

var app = express();
app.use(logger('dev'));
app.use(livereload({ port: 35729 }));
app.use(express.static(__dirname + '/public'));

browserify.settings({ transform: ['reactify'] });
app.get('/app.js', browserify('./app/js/app.js'));

var getFile = _.compose(_.first, _.flatten, _.values);

app.post('/optimize', function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, filesObj) {
    var file = getFile(filesObj);
    if (file === undefined) return res.send(400);

    var type = file.headers['content-type']
      , filename = file.originalFilename;

    console.log(format('got %s (%s; %d bytes)', filename, type, file.size))
    optimize(file.path, type).then(function(opted) {
      console.log(format('%s: optimized and now %d bytes', filename, opted.file.contents.length));
      res.set('Content-Type', type);
      res.send(opted.file.contents);
    }).catch(function(err) {
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
