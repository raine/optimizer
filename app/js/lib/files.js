var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
  , uuid = require('node-uuid')
  , api = require('./api')
;

var OPTIMIZE_ENDPOINT = '/optimize'
  , uploadFile = _.partial(api.uploadFile, OPTIMIZE_ENDPOINT);

var Files = function() {
  this.list = [];
};

Files.prototype = Object.create(EventEmitter.prototype);

Files.prototype.push = function(files) {
  this.list = this.list.concat(
    // _.map(_.flatten(files), _.compose(addId, file2obj))
    _.map(_.flatten(files), addId)
  );

  // TODO: init upload
  this.upload();
  this.emit('change');
};

Files.prototype.upload = function() {
  uploadFile(file2fd(this.list[0]))
};

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
