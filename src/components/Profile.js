import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Input from "./Input"
import '../App.css';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessage: "",
			hasErrors: false,
			isEdit: false,
			mode: 'usr'
		}

		this.handleCancel = this.handleCancel.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.activateEdit = this.activateEdit.bind(this);
		this.activatePassword = this.activatePassword.bind(this);
	}

	handleSubmit(evt) {
		evt.preventDefault();
		const $form = ReactDOM.findDOMNode(this.refs.form);
		const inputs = $form.querySelectorAll('input');

		let result = {};
		let canSubmit = true;
		let required = [];
		let errorMessage = [];
		inputs.forEach(input => {
			if(input.value !== "") {
				result[input.name] = input.value;

				//Checking to make sure new email is valid, otherwise gives an error
				if(input.name === 'email') {
					let valid = this.validateEmail(input.value);
					if(!valid) {
						canSubmit = false;
						errorMessage.push('Invalid Email');
					}
				}

				//Checking to make sure new input on birthday field to make sure they are atleast 18
				if(input.name === 'birthday') {
					let valid = this.validateDate(input.value);
					let age = this.calcAge(new Date(input.value));
					//making sure date is formated to be xx/xx/xxx
					if(!valid) {
						canSubmit = false;
						errorMessage.push('Date must be in mm-dd-yyyy format!');
					}
					//check to see if user is atleast 18
					if(age < 18 ) {
						canSubmit = false;
						errorMessage.push('You must have 18 years at least');
					}

				}

				//If oldpassword is incorrect when making a new password
				if(input.name === 'oldPassword') {
					let valid = input.value === this.props.user.password;
					if(!valid) {
						canSubmit = false;
						errorMessage.push('Incorrect old password');
					}
				}
			}
			else {
				canSubmit = false;
				required.push(input.name);
			}
		});

		//When change password is clicked, check to make sure newpass and confirmpass are the same before you can submit
		if(this.state.mode === 'pwd') {
			if(result.newPassword !== result.confirmPassword) {
				canSubmit = false;
				errorMessage.push("Confirm password doesn't match");
			}
		}

		if(canSubmit) {
			this.setState({hasErrors: false});
			this.submit(result, this.state.mode);
		}
		else {
			if(required.length > 0)
				errorMessage.push(`Required fields ${required.join(', ')}`);

			this.setState({
				hasErrors: true,
				errorMessage: errorMessage.join('\r\n')
			});
		}
	}

	submit(result, mode) {
		this.props.updateUser(result, this.props.user.id, mode);
		this.handleCancel();

		//using axios package to make the http post request
		if(mode === 'usr')
			axios.post('https://requestb.in/193von71', JSON.stringify(result));
		else
			axios.post('https://requestb.in/193von71', JSON.stringify(result));
	}

	//Makeing sure birthday is valid format mm-dd-yyyy
	validateDate(birthday){
		//regex string taken from stackoverflow
		var re = birthday.match(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/)
		return re;
	}

	//making sure email is valid format
	validateEmail(email) {
		//regex string taken from http://emailregex.com/
    var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
	}

	//Calculating age to see if user is atleast 18
	calcAge(birthday) {
		//Getting todays date and subtracting it by entered birthday date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
		//Getting the absolute value of the year
    return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	//if user hits cancel, turn edit mode off
	handleCancel(evt) {
		this.setState({isEdit:false, mode:'usr', hasErrors:false});
	}

	//if user hits edit, make fields editable
	activateEdit(evt) {
		this.setState({isEdit:true, mode:'usr'});
	}

	//if user hits change password, take user to update password form
	activatePassword(evt) {
		this.setState({isEdit:true, mode:'pwd'});
	}

	render() {
		const {firstName, lastName, password, jobTitle, email, birthday} = this.props.user;
		const isEdit = this.state.isEdit;

		let formFields;

		//User page display for fields, changes to type text if user hits edit
		if(this.state.mode === 'usr' ) {
			formFields = (
				<table className="table table-user-information">
					<tbody>
						<tr>
							<td>First Name</td>
							<td><Input name="firstName" dvalue={firstName} readonly={!isEdit}/></td>
						</tr>
						<tr>
							<td>Last Name</td>
							<td><Input name="lastName" dvalue={lastName} readonly={!isEdit} /></td>
						</tr>
						<tr>
							<td>Password</td>
							<td><Input name="password" dvalue={password} readonly/></td>
						</tr>
						<tr>
							<td>Job Title:</td>
							<td><Input name="jobTitle" dvalue={jobTitle} readonly={!isEdit} /></td>
						</tr>
						<tr>
							<td>Birthday</td>
							<td><Input name="birthday" dvalue={birthday} readonly={!isEdit}/></td>
						</tr>
						<tr>
							<td>Email</td>
							<td><Input name="email" dvalue={email} readonly={!isEdit}/></td>
						</tr>
					</tbody>
				</table>);
		}
		//user display if user hits change password
		else {
			formFields = (
			<table className="table table-user-information">
				<tbody>
					<tr>
						<td>Last Password</td>
						<td> <Input name="oldPassword" type="pwd" dvalue="" readonly={!isEdit} key="cpwd"/></td>
					</tr>
					<tr>
						<td>New Password</td>
						<td><Input name="newPassword" type="pwd"	dvalue="" readonly={!isEdit} key="npwd"/></td>
					</tr>
					<tr>
						<td>Confirm Password</td>
						<td><Input name="confirmPassword" type="pwd"	dvalue="" readonly={!isEdit} key="cpwd"/></td>
					</tr>
				</tbody>
			</table>);
		}

		let buttons;

		//buttons for if user has not clicked edit or change password
		if(!isEdit) {
			buttons = (
			<div className="panel-footer text-right">
				<button className="btn btn-sm btn-info" onClick={this.activateEdit}>
					<span>Edit</span>
				</button>
				<button className="btn btn-sm btn-danger" onClick={this.activatePassword}>
					<span>Change Password</span>
				</button>
			</div>);
		}

		//buttons for if user is in edit mode
		else {
			buttons = (
				<div className="panel-footer text-right">
					<button className="btn btn-sm btn-default" onClick={this.handleCancel}>
						<span>Cancel</span>
					</button>
					<button className="btn btn-sm btn-primary" onClick={this.handleSubmit}>
						<span>Submit</span>
					</button>
				</div>);
		}

		return (
			<div className="container profile">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xs-offset-0 col-sm-offset-0 col-md-offset-3 col-lg-offset-3 toppad" >
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">{`${firstName} ${lastName}`}</h3>
            </div>
            <div className="panel-body">
              <div className="row">
                <div className="col-md-3 col-lg-3 " align="center">
                    <img alt="Profile Pic"
                        src="https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg"
                        className="img-circle img-responsive" />
                </div>
                <div ref="form" className="col-md-9 col-lg-9">
									{formFields}
									{this.state.hasErrors && <div className="alert alert-dismissible alert-danger">
										<button type="button" className="close" data-dismiss="alert">×</button>
										{this.state.errorMessage}
									</div>}
                </div>
              </div>
            </div>
						{buttons}
          </div>
        </div>
      </div>
    </div>
		);
	}
}

export default Profile;
