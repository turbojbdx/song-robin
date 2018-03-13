import { Template } from 'meteor/templating'; 
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import '../../api/users.js';
import { RoomMessages } from '../../api/room_messages.js';
import { Rooms } from '../../api/rooms.js';

import './chat_box.html'

const setScrollBox = () => {
	const box     = document.getElementById("messages-box");
	box.scrollTop = box.scrollHeight;
}

Template.chat_box.onCreated(function showRoomCreated() {
	if(!Meteor.userId()) {
		return FlowRouter.go('home');
	}

	this.getRoomId = () => FlowRouter.getParam('_id');
	this.state     = new ReactiveDict();

	this.subscribe('users.public');
	this.subscribe('rooms.show', this.getRoomId());
	this.subscribe('room_messages.latest', this.getRoomId());
	this.autorun(() => { });
});

Template.chat_box.onRendered(function() {
	var template = this;

	this.autorun(function () {
	    if(template.subscriptionsReady()) {
	    	Tracker.afterFlush(function() {
	    		setScrollBox();
	    	});
	    }
	});
});

Template.chat_box.helpers({
	room() {
		return Rooms.findOne({ _id : FlowRouter.getParam('_id') });
	},
	latestMessages() {
		const selector = { room : FlowRouter.getParam('_id') };
		const opts     = { sort : { createdAt : -1 }, limit : 30 };
		const messages = RoomMessages.find(selector, opts).fetch();
		
		return messages.sort((a, b) => {
			return a.createdAt - b.createdAt;
		});
	},
	activeUsers() {
		const params = { _id : FlowRouter.getParam('_id') };
		const room   = Rooms.findOne(params);

		if(room) {
			return room.roomState.activeUsers;
		}
		else {
			return [];
		} 
	},
	userName(userId) {
		const user = Meteor.users.findOne({_id : userId});
		let name = "unkown_name";

		if(user.profile) {
			name = user.profile.name;
		}
		
		return name;
	},
	isntMe(userId) {
		return userId !== Meteor.userId();
	},
	imTheOwner() {
		const room = Rooms.findOne({ _id : FlowRouter.getParam('_id') });
		return room.owner === Meteor.userId();
	}
});

Template.chat_box.events({
	'submit #room-message-form' : (event, instance) => {
		event.preventDefault();
		const target  = event.target;
		const textBox = target.message;
		const message = $(textBox).val();

		Meteor.call('room_messages.insert', FlowRouter.getParam('_id'), message, function(err) {
			if(err) {
				alert(err);
				return;
			}
			
			$(textBox).val("");
		});
	},
	'change'(event, instance) {
		setTimeout(setScrollBox, 0);
	}
});
