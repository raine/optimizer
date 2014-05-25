/** @jsx React.DOM */
var React = require('react/addons')
  , cx = React.addons.classSet
  , ProgressBar = require('./progressbar')
;

var FileTableRow = React.createClass({
  render: function() {
    var file = this.props.file
      , progBar = this.refs.progbar

      , progCompleted     = progBar && progBar.completed
      , progStripedActive = file.state === 'OPTIMIZING' && progCompleted
      , progSuccess       = file.state === 'OPTIMIZED'
    ;

    return (
      <tr>
        <td>{file.name}</td>
        <td>
          <ProgressBar
            ref='progbar'
            now={file.bytesUploaded}
            max={file.bytesTotal}
            striped={progStripedActive}
            active={progStripedActive}
            success={progSuccess}
            onAnimEnd={this.forceUpdate.bind(this)}
          />
        </td>
        <td>{file.bytesUploaded}</td>
        <td>{file.bytesTotal}</td>
      </tr>
    );
  }
});

module.exports = FileTableRow;
