/** @jsx React.DOM */
var React = require('react')
;

var FileTableRow = React.createClass({
  render: function() {
    var file = this.props.file;
    var progress = {
      width: (file.bytesUploaded / file.bytesTotal * 100) + '%'
    };

    return (
      <tr>
        <td>{file.name}</td>
        <td>
          <div className="progress progress-striped active">
            <div className="progress-bar" role="progressbar" style={progress}></div>
          </div>
        </td>
        <td>{file.bytesUploaded}</td>
        <td>{file.bytesTotal}</td>
      </tr>
    );
  }
});

module.exports = FileTableRow;
