var MaterializeSelect = require('components/MaterializeSelect');

var BrocNote = React.createClass({

	getInitialState: function () {
		return {
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

	render: function () {
		return (
			<div className="container">
				<div className="row">
					<MaterializeSelect className="col s12" options={this.state.categories}></MaterializeSelect>
				</div>
			</div>
		)
	}
});

module.exports = BrocNote;