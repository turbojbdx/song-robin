import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Rooms } from './rooms.js'

const RoomMessages = new Mongo.Collection('room_messages');


const SSIdSchema = {
  type:     String, 
  regEx:    SimpleSchema.RegEx.Id, 
  optional: false
}

RoomMessages.schema = new SimpleSchema({
	message : {
		type : String, 
		max  : 800,
		min  : 2
	},
	room  : SSIdSchema,
	owner : SSIdSchema,
	createdAt : {
		type : Date, 
		optional : false
	}
});

if(Meteor.isServer) {
	Meteor.publish('room_messages.latest', function (roomId) {
		if(!this.userId) {
			return this.ready();
		}

		const room = Rooms.findOne({_id: roomId});
		
		if(!Rooms.userCanInteractWithRoom(this.userId, room)) {
			return this.ready();
		}

		return RoomMessages.find({ room : roomId });
	});
}

Meteor.methods({
  'room_messages.insert'(roomId, message) {
    check(roomId, String);
    check(message, String);
    // Make sure the user is logged in before inserting a room
    if (!Meteor.userId()) {
      	throw new Meteor.Error('not-authorized');
    }

    const room = Rooms.findOne({_id: roomId});

    if(!Rooms.userCanInteractWithRoom(Meteor.userId(), room)) {
    	throw new Meteor.Error('not-authorized');
    }

    const params = {
    	room      : room._id, 
    	owner     : Meteor.userId(), 
    	message   : message, 
    	createdAt : new Date() 
    };

    RoomMessages.schema.validate(params);
   
    RoomMessages.insert(params);
  }
});

module.exports.RoomMessages = RoomMessages;