import { Template } from 'meteor/templating'; 
import { Rooms } from '../../api/rooms.js'
import { ReactiveDict } from 'meteor/reactive-dict';

import './room.js';
import './rooms.html';

Template.rooms.onCreated(function roomsCreated() {
	Meteor.subscribe('rooms.mine');
});

Template.rooms.helpers({
	rooms() {
		const instance = Template.instance();
		return Rooms.find({});
	}
});

Template.rooms.events({
	'click #create-room'(event, instance) {
		$(".modal").modal("show");
	},
	'submit #create-room-form'(event, instance) {
		event.preventDefault();
		const target = event.target;
    	const name   = target.name.value;
    	
    	Meteor.call('rooms.insert', name, (err, res) => {
    		if(err) {
    			alert(JSON.stringify(err.details, null, 2))
    		}
    		else {
    			$(".modal").modal("hide");
    			target.name.value = '';
    		}
    	});
	}
});