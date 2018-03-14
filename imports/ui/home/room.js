import { Template } from 'meteor/templating'; 

import '../../api/rooms.js'
import './room.html'

Template.room.onCreated(function roomsCreated() {
	
});

Template.room.events({
	'click .anchor-destroy-room' : (event, instance) => {
		event.preventDefault();
		const anchor = event.target;
		const id = $(anchor).attr("data-room-id");

		const answer = confirm("are you sure?");

		if(!answer) {
			return;
		}

		Meteor.call('rooms.destroy', id);
	}      
})