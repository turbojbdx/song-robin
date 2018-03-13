import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Rooms } from './rooms.js';

const Invites = new Mongo.Collection('invites');

let SSIdSchema = {
  type     : String, 
  regEx    : SimpleSchema.RegEx.Id, 
  min      : 3,
  optional : false
}

Invites.schema = new SimpleSchema({
	from       : SSIdSchema, 
	room       : SSIdSchema,
	to         : SSIdSchema,
	fullfilled : {
		type         : Boolean,
		defaultValue : false
	},
	createdAt : {
    	type  : Date
  	}
});

if(Meteor.isServer) {
	Meteor.publish('invites.2-me', function() {
		if(!this.userId) {
			return this.ready();
		}

		return Invites.find({ 
			to         : this.userId, 
			fullfilled : false 
		});
	});
}

Meteor.methods({
	'invites.insert' : (to, roomId) => {
		check(to, String);
		check(roomId, String);
		
		if (!Meteor.userId()) {
      		throw new Meteor.Error('not-authorized');
    	}	

    	let selector = { _id : roomId }
    	const room     = Rooms.findOne(selector);

    	if(!room) {
    		throw new Meteor.Error(401, 'not-authorized');
    	}

    	if(room.owner !== Meteor.userId()) {
    		throw new Meteor.Error(401, 'not-authorized');
    	}

    	// create index

    	selector = {
    		from       : Meteor.userId(),
    		to         : to,
    		fullfilled : false
    	}

    	const invite = Invites.findOne(selector);

    	if(invite) {
    		throw new Meteor.Error(403, 'invite-exists');
    	}

    	const opts = {
    		from       : Meteor.userId(),
    		to         : to,
    		room       : room._id,
    		fullfilled : false,
    		createdAt  : new Date()
    	}

    	Invites.insert(opts);
	}
});

module.exports.Invites = Invites;