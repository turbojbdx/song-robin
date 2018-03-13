import { Template }     from 'meteor/templating'; 
import { FlowRouter }   from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Invites }      from '../../api/invites';
import { Rooms }        from '../../api/rooms';
import { Users }        from '../../api/users';

import './my_invites.html'

Template.my_invites.onCreated(function myInvitesCreated() {
	if(!Meteor.userId()) {
		return FlowRouter.go('home');
	}

	this.subscribe('invites.2-me');
	this.subscribe('rooms.find_one');
	this.subscribe('users.public');
});

Template.my_invites.onRendered(function() {});

Template.my_invites.helpers({
	invitesToMe : () => {
		return Invites.find({ 
			to         : Meteor.userId(), 
			fullfilled : false 
		});
	},
	roomName : (id) => {
		const room = Rooms.find({ _id : id}, {limit : 1}).fetch()[0];
		
		if(room) {
			return room.name
		}
	},
	userName : (id) => {
		const user = Meteor.users.find({ _id : id }, { limit : 1 }).fetch()[0];

		if(user) {
			return user.profile.name;
		}
	}
});

Template.my_invites.events({
	'click .join-room' : (event, instance) => {
		const button = event.target;
		const roomId = $(button).attr("data-room-id");	
		
		
	}
});