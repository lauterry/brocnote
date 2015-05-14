"use strict";

var BrocNote = require('components/BrocNote');

var App = {
	init: function init() {
		React.render(<BrocNote/>, document.getElementById('main'));
	}
};

module.exports = App;
