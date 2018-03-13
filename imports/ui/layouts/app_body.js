import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './app_body.html';

Template.app_body.onCreated(function() { 
		
});

Template.app_body.helpers({
	loggedIn() {
		return Meteor.userId() || false;
	}
});

Template.app_body.events({
	'click #log-out'  () {
		Meteor.logout(function() {
			FlowRouter.go("home");
		});
	}
});