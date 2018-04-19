import React, { Component } from 'react';

export default class Input extends Component {

	constructor(props) {
		super();
		this.state = { val: null };
		this.handleChange = this.handleChange.bind(this);
	}

  //updating the state of the value
	handleChange(e) {
		if(!this.props.readonly)
			this.setState({ val: e.currentTarget.value })
	}

	render() {
    //using the ternary operator to update values,
		const type = (this.props.type === 'pwd')? 'password' : 'text';
		const val = (this.state.val !== null )? this.state.val : this.props.dvalue;

    //changes the view of the user page if edit is clicked, making input fields text type
		return (this.props.readonly)?<span>{val}</span> :
						<input type={type}
							name={this.props.name}
							value={val}
							onChange={this.handleChange} />;
	}
}
