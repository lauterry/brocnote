var MaterializeInput = React.createClass({

	propsType: {
		placeholder: React.PropTypes.string,
		type: React.PropTypes.string,
		label: React.PropTypes.string
	},

	render: function () {
		return (
			<div className={(this.props.className || '') + " input-field"}>
				<input id={this.props.label} placeholder={this.props.placeholder} type={this.props.type} className="validate">
					<label htmlFor={this.props.label}>{this.props.label}</label>
				</input>
			</div>
		)
	}
});

module.exports = MaterializeInput;