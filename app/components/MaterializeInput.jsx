var MaterializeInput = React.createClass({

	propsType: {
		placeholder: React.PropTypes.string,
		type: React.PropTypes.string,
		label: React.PropTypes.string
	},

	render: function () {
		return (
			<div className={(this.props.className || '') + " input-field"}>
				<input placeholder={this.props.placeholder} type={this.props.type} className="validate">
					<label>{this.props.label}</label>
				</input>
			</div>
		)
	}
});

module.exports = MaterializeInput;