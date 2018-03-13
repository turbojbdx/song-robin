import { Template } from 'meteor/templating'; 
import { ReactiveDict } from 'meteor/reactive-dict';

import './register_login.html'

Template.register_login.onCreated(function registerLoginOnCreated() {
	this.showLogin = new ReactiveVar(true);

	$(document).ready(() => {
		                                                                                                                                                                                                                                              
	})
});

Template.register_login.onRendered(function () {
	$("#register-login").show();
});

Template.register_login.helpers({
	'showLogin' () {
		const instance = Template.instance();
		return instance.showLogin.get();
	}
});

Template.register_login.events({
	'click .login-or-register' : (event, instance) => {
  		event.preventDefault();
  		const target   = event.target;
  		const id       = $(target).attr("href");
		instance.showLogin.set(id === "flogin");
  	},
	'submit #flogin' : (event) => {
		event.preventDefault();
		const target   = event.target;
		const email    = event.target.email.value;
       	const password = event.target.password.value;

       	Meteor.loginWithPassword(email, password, function(err) {
       		if(err) {
       			alert(err.reason);
       		}
       	});
	},
	'submit #fregister' : (event) => {
		event.preventDefault();
		const target    = event.target;
		const email     = event.target.email.value;
       	const password  = event.target.password.value;
       	const firstName = event.target.first_name.value;
       	const lastName  = event.target.last_name.value;

       	Accounts.createUser({
       		email      : email,
       		password   : password,
       		first_name : firstName,
       		last_name  : lastName
       	}, (err) => {
       		if(err) {
       			console.log(err);
       		}
       	});
	},
	'click .login-fb' : (event) => {
		event.preventDefault();

		Meteor.loginWithFacebook({}, (err) => {
			if(err) alert(err.reason);
		});
	}
});