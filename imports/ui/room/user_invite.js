import { Template } from 'meteor/templating'; 
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import '../../api/users.js';
import { Rooms } from '../../api/rooms.js';

import './user_invite.html';


Template.user_invite.onCreated(function showRoomCreated() {
	this.getRoomId = () => FlowRouter.getParam('_id');
	this.invite    = new ReactiveVar();
});


Template.user_invite.rendered = function() {
	let me = this;
	Meteor.typeahead.inject();
}

Template.user_invite.helpers({
	'usersSearch' : (query, sync, cb) => {
		Meteor.call('users.search', query, (err, res) => {
			if(err) {
				alert(err);
				return;
			}
			
			cb(res);
		});
	},
	'userSelected' : (event, user) => {
		$("#invite-user-id").val(user.uid);
		return user;
	}
});

Template.user_invite.events({
	'click #send-invite' : function() {
		const userId = $("#invite-user-id").val();
		const roomId = FlowRouter.getParam("_id");

		if(userId.length == 0) {
			alert("pick user");
			return;
		}

		Meteor.call('invites.insert', userId, roomId, (err, res) => {
			if(err) {
				alert(err);
				return;
			}
			
			alert("Invite Sent!");

			$('#invite-modal').modal('hide');
			$('#invite-user-id').val('');
			$('.typeahead').typeahead('val', '');
		});
	}
});


