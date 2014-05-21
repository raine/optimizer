/** @jsx React.DOM */
var React = require('react/addons')
  , Dropzone = require('../lib/dropzone')
  , FileTable = require('./filetable')
;

var App = React.createClass({
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

  render: function() {
    return (
      <FileTable files={this.props.files}></FileTable>
    );
  }
});

module.exports = App;
