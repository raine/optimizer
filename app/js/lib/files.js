var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
;

var Files = function() {
  this.list = [];
};

Files.prototype = Object.create(EventEmitter.prototype);

Files.prototype.push = function(files) {
  this.list = this.list.concat(_.flatten(_.map(files, file2obj)));
  this.emit('change');
};

// Convert a FileList file into a new object
function file2obj(file) {
  return _.pick(file, ['name', 'size', 'type']);
}

module.exports = Files;
