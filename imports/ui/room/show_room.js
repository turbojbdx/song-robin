import { Template }          from 'meteor/templating'; 
import { FlowRouter }        from 'meteor/kadira:flow-router';
import { ReactiveDict }      from 'meteor/reactive-dict';
import '../../api/users.js';
import { RoomMessages }      from '../../api/room_messages.js';
import { Rooms }             from '../../api/rooms.js';


import './show_room.html'

const setScrollBox = () => {
	const box     = document.getElementById("messages-box");
	box.scrollTop = box.scrollHeight;
}

Template.show_room.onCreated(function showRoomCreated() {
	if(!Meteor.userId()) {
		return FlowRouter.go('home');
	}

	this.subscribe('rooms.show', FlowRouter.getParam('_id'));
});

Template.show_room.onRendered(function() {
	
});

Template.show_room.helpers({
	room() {
		return Rooms.findOne({ _id : FlowRouter.getParam('_id') });
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
		console.log(room);


		return room.owner === Meteor.userId();
	}
});
