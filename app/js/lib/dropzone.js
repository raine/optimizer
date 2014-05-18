var EventEmitter = require('events').EventEmitter
  , _ = require('lodash')
;

function Dropzone(elem) {
  var emitter = new EventEmitter();
  var emit = emitter.emit.bind(emitter, 'drop');

  // This handler seems to be required for drop handler to work
  elem.addEventListener('dragover', stop, false);
  elem.addEventListener('drop', _.compose(emit, stop), false);

  return emitter;
}

function stop(ev) {
  ev.stopPropagation();
  ev.preventDefault();

  return ev;
}

module.exports = Dropzone;
