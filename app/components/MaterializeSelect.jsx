var MaterializeSelect = React.createClass({

	propsType: {
		options: React.PropTypes.arrayOf(React.PropTypes.shape({
			value: React.PropTypes.string,
			label: React.PropTypes.string
		}))
	},

	componentDidMount: function () {
		$(React.findDOMNode(this.refs.categories)).material_select();
	},

	render: function () {
		var options = this.props.options.map(function (option) {
			return <option value={option.value} key={option.value}>{option.label}</option>
		});

		return (
			<div className={(this.props.className || '') + " input-field"}>
				<select ref="categories">
					<option defaultValue="0" disabled>Choisir une catégorie</option>
					{options}
				</select>
				<label>Objets</label>
			</div>
		)
	}
});

module.exports = MaterializeSelect;