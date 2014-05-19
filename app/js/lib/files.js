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
  // this.processing = [];
  // this.curUploads = 0;
};

Files.prototype = Object.create(EventEmitter.prototype);

Files.prototype.push = function(files) {
  var added = _.map(_.flatten(files), addId);
  this.list = this.list.concat(added);
  this.initUpload();
  this.emit('change');
};

// Check if we are uploading max amount of files
// Get the first file that is not being uploaded
// Call self again
Files.prototype.initUpload = function() {
  var next = _.find(this.list, notUploading);
  next && this.upload(next);
};

Files.prototype.upload = function(file) {
  // file.uploading = true;

  uploadFile(file2fd(file)).then(function() {
    // file.uploading = false;
    // TODO: Upload more if can
  });
};

Files.prototype.uploading = function() {
  return _.filter(this.list, { uploading: true });
};

function notUploading(file) {
  return file.uploading !== true;
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

module.exports = Files;
