var MaterializeSelect = React.createClass({

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
			return <option value={option.value} key={option.value}>{option.label}</option>
		});

		return (
			<div className={(this.props.className || '')}>
				<label>Objets</label>
				<select className="browser-default" ref="select" value={this.props.selectedValue} onChange={this.props.onChange}>
					<option value="0" disabled>Choisir une catégorie</option>
					{options}
				</select>
			</div>
		)
	}
});

module.exports = MaterializeSelect;