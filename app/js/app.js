/** @jsx React.DOM */
var React = window.React = require('react')
  , $ = require('jquery')
  , _ = require('lodash')
  , Dropzone = require('./lib/dropzone')
  , Files = require('./lib/files')
;

var App = React.createClass({
  // getInitialState: function () {
  //   return { };
  // },

  componentDidMount: function() {
    Dropzone(document.body)
      .on('drop', this.handleDrop);
  },

  handleDrop: function(ev) {
    var fileList = ev.dataTransfer.files;
    if (fileList.length) {
      if (!window.FormData) {
        return console.error('FormData not available');
      }

      this.props.files.push(fileList);
    }
  },

  render: function () {
    return (
      // Table component
      //  - give files as prop
      <div></div>
    );
  }
});

function render() {
  React.renderComponent(
    <App files={files} />,
    document.getElementById('app')
  );
}

var files = new Files();
files.on('change', render);

render();
