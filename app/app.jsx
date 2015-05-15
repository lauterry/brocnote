"use strict";

var Router = ReactRouter;
var routes = require('routes');

var App = {
	init: function init() {
		Router.run(routes, function (Handler) {
			React.render(<Handler/>, document.getElementById('main'));
		});
	}
};

module.exports = App;
