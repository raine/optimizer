var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , uuid = require('node-uuid')
  , api = require('./api')
;

var MAX_UPLOADS = 4
  , OPTIMIZE_ENDPOINT = '/optimize'
  , uploadFile = _.partial(api.uploadFile, OPTIMIZE_ENDPOINT);

var Files = function() {
  this.list = [];
};

Files.prototype = Object.create(EventEmitter.prototype);

Files.prototype.push = function(files) {
  var added = _.map(_.flatten(files), addId);
  this.list = this.list.concat(added);
  this.initUpload();
};

Files.prototype.initUpload = function() {
  this.upload(this.next2upload());
  this.emit('change');
};

Files.prototype.upload = maybe(function(file) {
  if (this.uploading().length >= MAX_UPLOADS) return;

  // TODO: manage state with one property instead of multiple booleans?
  file.uploading = true;
  uploadFile(file2fd(file)).then(function() {
    file.uploading = false;
    file.uploaded  = true;
    this.initUpload();
  }.bind(this)).progressed(function(ev) {
    file.bytesUploaded = ev.position  || ev.loaded
    file.bytesTotal    = ev.totalSize || ev.total
    this.emit('change');
  }.bind(this));

  this.initUpload();
});

Files.prototype.next2upload = function() {
  return _.find(this.list, shouldUpload);
};

Files.prototype.uploading = function() {
  return _.filter(this.list, { uploading: true });
};

function shouldUpload(file) {
  return file.uploading !== true && file.uploaded !== true;
}

function addId(obj) {
  return _.extend(obj, {
    id: uuid.v4()
  });
}

// Convert a FileList file into a new object
function file2obj(file) {
  return _.pick(file, ['name', 'size', 'type']);
}

function file2fd(file) {
  var fd = new FormData();
  fd.append('file', file, file.name);
  return fd;
}

function maybe(fn) {
  return function() {
    var i;

    if (arguments.length === 0) {
      return;
    } else {
      for (i = 0; i < arguments.length; ++i) {
        if (arguments[i] == null) return;
      }
      return fn.apply(this, arguments)
    }
  }
}

module.exports = Files;
