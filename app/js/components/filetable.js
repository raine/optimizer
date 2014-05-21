/** @jsx React.DOM */
var React = require('react/addons')
  , _ = require('lodash')
  , FileTableRow = require('./filetablerow')
;

var FileTable = React.createClass({
  render: function() {
    var rows = _.map(this.props.files.list, function(file) {
      return <FileTableRow key={file.id} file={file} />
    });

    return (
      <table className="table table-striped files">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

module.exports = FileTable;
