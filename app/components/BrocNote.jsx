var MaterializeSelect = require('components/MaterializeSelect');
var MaterializeInput = require('components/MaterializeInput');

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
					<MaterializeInput className="col s6" label="Nombre" type="tel"></MaterializeInput>
					<MaterializeInput className="col s6" label="Prix (€)" type="tel"></MaterializeInput>
					<button className="col s12 waves-effect waves-light btn-large green">Ajouter</button>
				</div>
			</div>
		)
	}
});

module.exports = BrocNote;