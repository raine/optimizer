/** @jsx React.DOM */
var React = window.React = require('react/addons')
  , Files = require('./lib/files')
  , App = require('./components/app')
;

function render() {
  React.renderComponent(
    <App files={files} />,
    document.getElementById('app')
  );
}

var files = new Files();
files.on('change', render);

render();
