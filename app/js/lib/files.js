var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , uuid = require('node-uuid')
  , api = require('./api')
;

var FILE_DROPPED    = 'DROPPED';
var FILE_UPLOADING  = 'UPLOADING';
var FILE_OPTIMIZING = 'OPTIMIZING';
var FILE_OPTIMIZED  = 'OPTIMIZED';

var MAX_UPLOADS = 4
  , OPTIMIZE_ENDPOINT = '/optimize'
  , uploadFile = _.partial(api.uploadFile, OPTIMIZE_ENDPOINT);

var Files = function() {
  this.list = [];
};

Files.prototype = Object.create(EventEmitter.prototype);

// `push` for an array is bad semantics
Files.prototype.push = function(files) {
  var added = _.map(_.flatten(files), prepareFile);
  this.list = this.list.concat(added);
  this.initUpload();
};

Files.prototype.initUpload = function() {
  this.upload(this.next2upload());
  this.emit('change');
};

Files.prototype.upload = maybe(function(file) {
  if (this.uploading() >= MAX_UPLOADS) return;

  // TODO: Handle optimizing state correctly
  file.state = FILE_UPLOADING;
  uploadFile(file2fd(file)).then(function() {
    file.state = FILE_OPTIMIZED;
    this.initUpload();
  }.bind(this)).progressed(function(ev) {
    file.bytesUploaded = ev.position  || ev.loaded
    file.bytesTotal    = ev.totalSize || ev.total
    this.emit('change');
  }.bind(this));

  this.initUpload();
});

Files.prototype.next2upload = function() {
  return _.find(this.list, { state: FILE_DROPPED });
};

Files.prototype.uploading = function() {
  return _.filter(this.list, { state: FILE_UPLOADING }).length;
};

function prepareFile(file) {
  return _.extend(file, {
    state : FILE_DROPPED,
    id    : uuid.v4()
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

// From JavaScript Allongé by raganwald
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
