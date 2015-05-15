var Router = ReactRouter;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Application = require('components/Application');
var BrocNote = require('components/BrocNote');

var routes = (
	<Route name="app" path="/" handler={Application}>
		<DefaultRoute handler={BrocNote}/>
	</Route>
);


module.exports = routes;