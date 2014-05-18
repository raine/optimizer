/** @jsx React.DOM */
var React = window.React = require('react')
  , Dropzone = require('../lib/dropzone')
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

module.exports = App;
