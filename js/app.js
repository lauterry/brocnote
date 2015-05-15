(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
(function() {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = (window.brunch || {});
  var ar = br['auto-reload'] = (br['auto-reload'] || {});
  if (!WebSocket || ar.disabled) return;

  var cacheBuster = function(url){
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') +'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function(){
      window.location.reload(true);
    },

    stylesheet: function(){
      [].slice
        .call(document.querySelectorAll('link[rel="stylesheet"][href]:not([data-autoreload="false"]'))
        .forEach(function(link) {
          link.href = cacheBuster(link.href);
        });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function() { document.body.offsetHeight; }, 25);
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function(){
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function(event){
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function(){
      if (connection.readyState) connection.close();
    };
    connection.onclose = function(){
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();

require.register("app", function(exports, require, module) {
"use strict";

var Router = ReactRouter;
var routes = require('routes');

var App = {
	init: function init() {
		Router.run(routes, function (Handler) {
			React.render(React.createElement(Handler, null), document.getElementById('main'));
		});
	}
};

module.exports = App;

});

require.register("components/Application", function(exports, require, module) {
var Router = ReactRouter;
var RouteHandler = Router.RouteHandler;

var Application = React.createClass({displayName: 'Application',
	render: function () {
		return (
			React.createElement("div", null, 
				React.createElement(RouteHandler, null)
			)
		);
	}
});

module.exports = Application;
});

require.register("components/BrocNote", function(exports, require, module) {
var Router = ReactRouter;
var RouteHandler = Router.RouteHandler;
var MaterializeSelect = require('components/MaterializeSelect');
var MaterializeInput = require('components/MaterializeInput');

var BrocNote = React.createClass({displayName: 'BrocNote',

	mixins: [ReactFireMixin],

	getInitialState: function () {
		return {
			brocantes : [],
			count: 0,
			price: 0,
			object: "vetements",
			categories : [{
				value: "vetements",
				label: "Vêtements"
			}, {
				value: "livres",
				label: "Livres"
			}, {
				value: "jouets",
				label: "Jouets"
			}]
		}
	},

	componentWillMount: function() {
		this.bindAsArray(new Firebase("https://brocnote.firebaseio.com/brocantes"), "brocantes");
	},

	addPurchase: function () {
		this.firebaseRefs["brocantes"].push({
			object: this.state.object,
			count: this.state.count,
			price: this.state.price
	 	});
		this.setState({
			count: 0,
			price: 0,
			object: "vetements"
		});
	},

	updateCount: function (ev) {
		this.setState({
			count: ev.target.value
		});
	},

	updatePrice: function (ev) {
		this.setState({
			price: ev.target.value
		});
	},

	updateObject: function (ev) {
		this.setState({
			object: ev.target.value
		});
	},

	render: function () {
		return (
			React.createElement("div", {className: "container"}, 
				React.createElement("div", {className: "row"}, 
					React.createElement(MaterializeSelect, {className: "col s12", options: this.state.categories, selectedValue: this.state.object, onChange: this.updateObject}), 
					React.createElement(MaterializeInput, {className: "col s6", name: "count", label: "Nombre", type: "tel", value: this.state.count, onChange: this.updateCount}), 
					React.createElement(MaterializeInput, {className: "col s6", name: "price", label: "Prix (€)", type: "tel", value: this.state.price, onChange: this.updatePrice}), 
					React.createElement("button", {className: "col s12 waves-effect waves-light btn-large green", onClick: this.addPurchase}, "Ajouter")
				), 


				React.createElement("div", {clasName: "row"}, 
					React.createElement("table", {className: "bordered"}, 
						React.createElement("thead", null, 
							React.createElement("tr", null, 
								React.createElement("th", {'data-field': "object"}, "Object"), 
								React.createElement("th", {'data-field': "count"}, "Nombre"), 
								React.createElement("th", {'data-field': "price"}, "Prix")
							)
						), 

						React.createElement("tbody", null, 
							
								this.state.brocantes.map(function(brocante){
									return React.createElement("tr", {className: "collection-item"}, 
										React.createElement("td", null, brocante.object), 
										React.createElement("td", null, brocante.count), 
										React.createElement("td", null, brocante.price)
									)
								})
							
						)
					)
				), 
				React.createElement(RouteHandler, null)
			)
		)
	}
});

module.exports = BrocNote;
});

require.register("components/MaterializeInput", function(exports, require, module) {
var MaterializeInput = React.createClass({displayName: 'MaterializeInput',

	propsType: {
		placeholder: React.PropTypes.string,
		type: React.PropTypes.string,
		label: React.PropTypes.string,
		name: React.PropTypes.string,
		value: React.PropTypes.string,
		onChange: React.PropTypes.func
	},

	render: function () {
		return (
			React.createElement("div", {className: (this.props.className || '') + " input-field"}, 
				React.createElement("input", {id: this.props.name, 
					placeholder: this.props.placeholder, 
					type: this.props.type, 
					className: "validate", 
					onChange: this.props.onChange, 
					value: this.props.value}, 
					React.createElement("label", {htmlFor: this.props.name}, this.props.label)
				)
			)
		)
	}
});

module.exports = MaterializeInput;
});

require.register("components/MaterializeSelect", function(exports, require, module) {
var MaterializeSelect = React.createClass({displayName: 'MaterializeSelect',

	propsType: {
		selectedValue:  React.PropTypes.string,
		onChange: React.PropTypes.func,
		options: React.PropTypes.arrayOf(React.PropTypes.shape({
			value: React.PropTypes.string,
			label: React.PropTypes.string
		}))
	},

	componentDidMount: function () {
		$(React.findDOMNode(this.refs.select)).material_select();
	},

	render: function () {
		var options = this.props.options.map(function (option) {
			return React.createElement("option", {value: option.value, key: option.value}, option.label)
		});

		return (
			React.createElement("div", {className: (this.props.className || '')}, 
				React.createElement("label", null, "Objets"), 
				React.createElement("select", {className: "browser-default", ref: "select", value: this.props.selectedValue, onChange: this.props.onChange}, 
					React.createElement("option", {value: "0", disabled: true}, "Choisir une catégorie"), 
					options
				)
			)
		)
	}
});

module.exports = MaterializeSelect;
});

require.register("routes", function(exports, require, module) {
var Router = ReactRouter;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Application = require('components/Application');
var BrocNote = require('components/BrocNote');

var routes = (
	React.createElement(Route, {name: "app", path: "/", handler: Application}, 
		React.createElement(DefaultRoute, {handler: BrocNote})
	)
);


module.exports = routes;
});


//# sourceMappingURL=app.js.map