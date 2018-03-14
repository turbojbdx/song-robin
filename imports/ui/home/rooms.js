import { Template }     from 'meteor/templating'; 
import { Rooms }        from '../../api/rooms.js';
import { Invites }      from '../../api/invites.js';
import { ReactiveDict } from 'meteor/reactive-dict';


import './room.js';
import './rooms.html';

Template.rooms.onCreated(function roomsCreated() {
	Meteor.subscribe('rooms.mine');
	Meteor.subscribe('rooms.find_one');
	Meteor.subscribe('invites.2-me-fullfilled');
});

Template.rooms.helpers({
	rooms : () => {
		return Rooms.find({
			owner : Meteor.userId()
		});
	},
	invitedRooms : () => {
		let selector = { 
			to : Meteor.userId(), 
			fullfilled : true 
		};

		let opts = {
			fields : {
				"room" : 1
			}
		}

		let roomIds = Invites.find(selector, opts).fetch().map(i => i.room);

		selector = {
			_id : {
				$in : roomIds
			}
		}

		return Rooms.find(selector);
	}
});

Template.rooms.events({
	'click #create-room' : (event, instance) => {
		$(".modal").modal("show");
	},
	'submit #create-room-form' : (event, instance) => {
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