var express = require('express')
  , logger = require('morgan')
  , http = require('http')
  , multiparty = require('multiparty')
  , _ = require('lodash')
  , Imagemin = require('imagemin')
  , zopfli = require('imagemin-zopfli')
  , Promise = require('bluebird')
  , path = require('path')
  , tmp = Promise.promisifyAll(require('tmp'))
  , util = require('util')
  , format = util.format
  , browserify = require('browserify-middleware')
  , livereload = require('connect-livereload')
;

var app = express();
app.use(logger('dev'));
app.use(livereload({ port: 35729 }));
app.use(express.static(__dirname + '/public'));

browserify.settings({ transform: ['reactify'] });
app.get('/app.js', browserify('./app/js/app.js'));

app.post('/optimize', function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if (_.isEmpty(files) || files.file === undefined) {
      res.send(400);
    } else {
      var file = files.file[0] // Assume one file
        , type = file.headers['content-type']
        , filename = file.originalFilename;

      console.log(format('got %s (%s; %d bytes)', filename, type, file.size))
      optimize(file.path, type).then(function(file) {
        console.log(format('%s: optimized and now %d bytes', filename, file.contents.length));
        res.set('Content-Type', type);
        res.send(file.contents);
      }).catch(fail);
    }
  });
});

var server = http.createServer(app);
server.listen(process.env.PORT || 3001, function() {
  console.log('express listening at %s', server.address().port);
});

function fail(res) {
  return function(err) {
    console.log('something went wrong:', err);
    res.send(500);
  };
}

var middlewares = {
  'image/png': [
    Imagemin.pngquant(),
    Imagemin.optipng({ optimizationLevel: 0 })
    // zopfli()
  ],
  'image/jpeg': [
    Imagemin.jpegtran({ progressive: true })
  ]
};

var acceptedType = _.partial(_.contains, _.keys(middlewares));

function optimize(file_path, mime) {
  return new Promise(function(resolve, reject) {
    if (!acceptedType(mime)) {
      return reject('Invalid mime type');
    }

    tmp.fileAsync({
      mode    : 0644,
      postfix : path.extname(file_path)
    }).spread(function(tmp_path) {
      var imagemin = new Imagemin()
        .src(file_path)
        .dest(tmp_path);

      _.each(middlewares[mime], function(ware) {
        imagemin.use(ware);
      });

      Promise.props({
        dest: tmp_path,
        file: Promise.promisify(imagemin.optimize, imagemin)()
      }).then(resolve);
    });
  });
}
