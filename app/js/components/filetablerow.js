/** @jsx React.DOM */
var React = require('react/addons')
  , cx = React.addons.classSet
;

var FileTableRow = React.createClass({
  render: function() {
    var file = this.props.file;
    var progress = {
      width: (file.bytesUploaded / file.bytesTotal * 100) + '%'
    };

    var progClass = cx({
      'progress': true,
      'progress-striped active': file.state === 'OPTIMIZING'
    });

    var progInnerClass = cx({
      'progress-bar': true,
      'progress-bar-success': file.state === 'OPTIMIZED',
    });

    return (
      <tr>
        <td>{file.name}</td>
        <td>
          <div className={progClass}>
            <div
              className={progInnerClass}
              role="progressbar"
              style={progress}
            />
          </div>
        </td>
        <td>{file.bytesUploaded}</td>
        <td>{file.bytesTotal}</td>
      </tr>
    );
  }
});

module.exports = FileTableRow;
