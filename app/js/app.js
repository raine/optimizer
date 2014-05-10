/** @jsx React.DOM */
var React = window.React = require('react');

var App = React.createClass({
  render: function () {
    return
      <div>
        <Header/>
        <div className="container content">
          <Posts/>
        </div>
      </div>;
  }
});
