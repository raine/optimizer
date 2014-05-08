var express = require('express')
  , logger = require('morgan')
  , http = require('http')
  , multiparty = require('multiparty')
  , _ = require('lodash')
  , Imagemin = require('imagemin')
  , Promise = require('bluebird')
  , path = require('path')
  , tmp = Promise.promisifyAll(require('tmp'))
  , util = require('util')
  , format = util.format
;

var app = express();
app.use(logger());

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
        res.send(file);
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

function optimize(file_path, mime) {
  return tmp.fileAsync({
    mode    : 0644,
    postfix : path.extname(file_path)
  }).spread(function(tmp_path) {
    var imagemin = new Imagemin()
      .src(file_path)
      .dest(tmp_path);

    _.each(middlewares(mime), function(ware) {
      imagemin.use(ware);
    });

    return Promise.promisify(imagemin.optimize, imagemin)();
  });
}

function middlewares(mime) {
  return {
    'image/png': [
      Imagemin.pngquant(),
      Imagemin.optipng({ optimizationLevel: 3 })
    ],
    'image/jpg': [
      Imagemin.jpegtran({ progressive: true })
    ]
  }[mime];
}
