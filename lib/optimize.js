var _ = require('lodash')
  , Imagemin = require('imagemin')
  , zopfli = require('imagemin-zopfli')
  , Promise = require('bluebird')
  , path = require('path')
  , tmp = Promise.promisifyAll(require('tmp'))
;

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

module.exports = optimize;
