var Router = ReactRouter;
var RouteHandler = Router.RouteHandler;
var MaterializeSelect = require('components/MaterializeSelect');
var MaterializeInput = require('components/MaterializeInput');

var BrocNote = React.createClass({

	mixins: [ReactFireMixin],

	getInitialState: function () {
		return {
			brocantes : [],
			count: undefined,
			price: undefined,
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
		var date = moment().valueOf();
		this.firebaseRefs["brocantes"].push({
			object: this.state.object,
			count: this.state.count || 0,
			price: this.state.price || 0,
			added: date
	 	});
		this.setState({
			count: undefined,
			price: undefined,
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
		var quantityTotal = 0,
			priceTotal = 0;

		this.state.brocantes.forEach(function (brocante) {
			quantityTotal = quantityTotal + +brocante.count;
			priceTotal = priceTotal + +brocante.price;
		});

		return (
			<div className="container">
				<div className="row">

					<div id="form-block" className="card grey lighten-5">
						<form className="card-content">
							<MaterializeSelect className="col s12" options={this.state.categories} selectedValue={this.state.object} onChange={this.updateObject}></MaterializeSelect>
							<MaterializeInput className="col s6" name="count" label="Nombre" type="tel" value={this.state.count} onChange={this.updateCount}></MaterializeInput>
							<MaterializeInput className="col s6" name="price" label="Prix (€)" type="tel" value={this.state.price} onChange={this.updatePrice}></MaterializeInput>
							<button className="col s12 waves-effect waves-light btn-large green" onClick={this.addPurchase}>Ajouter</button>
						</form>
					</div>

				</div>

				<div className="row">
					<div className="card">
						<p className="stats">
							<span className="stats-item">Quantité total : {quantityTotal}</span>
							<span className="stats-item">Prix total : {priceTotal} €</span>
						</p>
					</div>
				</div>

				<div clasName="row">
					<table className="bordered">
						<thead>
							<tr>
								<th data-field="object">Type</th>
								<th data-field="count">Qté</th>
								<th data-field="price">Prix</th>
							</tr>
						</thead>

						<tbody>
							{

								_.sortBy(this.state.brocantes, "added").reverse().map(function(brocante){
									return <tr className="collection-item">
										<td>{brocante.object}</td>
										<td>{brocante.count}</td>
										<td>{brocante.price} €</td>
									</tr>
								})
							}
						</tbody>
					</table>
				</div>
				<RouteHandler/>
			</div>
		)
	}
});

module.exports = BrocNote;