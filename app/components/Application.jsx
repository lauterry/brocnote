var Router = ReactRouter;
var RouteHandler = Router.RouteHandler;

var Application = React.createClass({
	render: function () {
		return (
			<div>
				<RouteHandler/>
			</div>
		);
	}
});

module.exports = Application;