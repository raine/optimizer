/** @jsx React.DOM */
var React = require('react/addons')
  , cx = React.addons.classSet
;

var transitionEndEvent = whichTransitionEvent();

var ProgressBar = React.createClass({
  completed: false,

  componentDidMount: function() {
    var progInner = this.refs.progInner.getDOMNode();
    progInner.addEventListener(transitionEndEvent, function() {
      this.completed = true;
      this.props.onAnimEnd && this.props.onAnimEnd();
    }.bind(this));
  },

  render: function() {
    var progress = {
      width: (this.props.now / this.props.max * 100) + '%'
    };

    var progClass = cx({
      'progress': true,
      'progress-striped': this.props.striped,
      'progress-striped active': this.props.active
    });

    var progInnerClass = cx({
      'progress-bar': true,
      'progress-bar-success': this.props.success
    });

    return (
      <div className={progClass}>
        <div
          ref="progInner"
          className={progInnerClass}
          role="progressbar"
          style={progress}
        />
      </div>
    );
  }
});

module.exports = ProgressBar;

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
