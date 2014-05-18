/** @jsx React.DOM */
var React = require('react')
  , _ = require('lodash')
  , FileTableRow = require('./filetablerow')
;

var FileTable = React.createClass({
  render: function() {
    var rows = _.map(this.props.files.list, function(file) {
      return <FileTableRow key={file.id} file={file} />
    });

    return (
      <table className="table table-striped">
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

module.exports = FileTable;
