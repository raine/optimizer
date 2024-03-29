var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , uuid = require('node-uuid')
  , api = require('./api')
  , maybe = require('./utils').maybe
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
  var added = _.map(_.flatten(files), file2obj);
  this.list = this.list.concat(added);
  this.initUpload();
};

Files.prototype.initUpload = function() {
  this.upload(this.next2upload());
  this.emit('change');
};

Files.prototype.upload = maybe(function(file) {
  if (this.uploading() >= MAX_UPLOADS) return;
  file.state = FILE_UPLOADING;
  this.initUpload();

  // TODO: Handle errors
  uploadFile(file2fd(file.__file)).then(function(file) {
    file.state = FILE_OPTIMIZED;
    file.bytesNewSize = file.new_size;
    this.initUpload();
  }.bind(this)).progressed(function(ev) {
    file.bytesUploaded = ev.position  || ev.loaded
    file.bytesTotal    = ev.totalSize || ev.total

    if (file.bytesUploaded === file.bytesTotal) {
      file.state = FILE_OPTIMIZING;
    }

    this.emit('change');
  }.bind(this));
});

Files.prototype.next2upload = function() {
  return _.find(this.list, { state: FILE_DROPPED });
};

Files.prototype.uploading = function() {
  return _.filter(this.list, { state: FILE_UPLOADING }).length;
};

function file2obj(file) {
  return _.extend({}, {
    state  : FILE_DROPPED,
    id     : uuid.v4(),
    __file : file
  }, file);
}

function file2fd(file) {
  var fd = new FormData();
  fd.append('file', file, file.name);
  return fd;
}

module.exports = Files;
