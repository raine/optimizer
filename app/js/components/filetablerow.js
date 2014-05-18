/** @jsx React.DOM */
var React = require('react')
;

var FileTableRow = React.createClass({
  render: function() {
    var file = this.props.file;

    return (
      <tr>
        <td>{file.name}</td>
        <div className="progress progress-striped active">
          <div className="progress-bar" role="progressbar"></div>
        </div>
      </tr>
    );
  }
});

module.exports = FileTableRow;
