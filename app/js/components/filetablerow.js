/** @jsx React.DOM */
var React = require('react/addons')
  , cx = React.addons.classSet
;

var transitionEndEvent = whichTransitionEvent();

// TODO: Extract progress bar to a separate component
var FileTableRow = React.createClass({
  getInitialState: function() {
    return {
      progAnimReady: false
    };
  },

  componentDidMount: function() {
    var progInner = this.refs.progInner.getDOMNode();
    progInner.addEventListener(transitionEndEvent, function() {
      this.setState({ progAnimReady: true });
    }.bind(this));
  },

  render: function() {
    var file = this.props.file;
    var progress = {
      width: (file.bytesUploaded / file.bytesTotal * 100) + '%'
    };

    var progClass = cx({
      'progress': true,
      'progress-striped active': file.state === 'OPTIMIZING' && this.state.progAnimReady
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
              ref="progInner"
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

function whichTransitionEvent() {
  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'transition'       : 'transitionend',
    'OTransition'      : 'oTransitionEnd',
    'MozTransition'    : 'transitionend',
    'WebkitTransition' : 'webkitTransitionEnd'
  }

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}
