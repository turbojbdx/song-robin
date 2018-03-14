import { Mongo }   from 'meteor/mongo';
import { check }   from 'meteor/check';
import { Invites } from './invites';

const Rooms = new Mongo.Collection('rooms');

let SSIdSchema = {
  type:     String, 
  regEx:    SimpleSchema.RegEx.Id, 
  min :     3,
  optional: false
}

let roomStateSchema = new SimpleSchema({
  playing : {
    type         : Boolean,
    defaultValue : false
  },
  activeUsers : {
    type : [ SSIdSchema ]
  }
});

Rooms.schema = new SimpleSchema({
  name : {
    type:     String,
    min :     3,
    max :     200,
    optional: false
  },
  owner       : SSIdSchema,
  guests      : { 
    type : [ SSIdSchema ],
    defaultValue : []
  },
  roomState : {
    type : roomStateSchema
  },
  userState : {
    type : Object
  },
  createdAt : {
    type : Date
  }
});

Rooms.userCanInteractWithRoom = (userId, room) => {
  return room.owner === userId       || 
         room.guests.indexOf(userId) !== -1;
};

if(Meteor.isServer) {
  // This code only runs on the server
  
  Meteor.publish('rooms.mine', function myRoomsPublication() {
    if (!this.userId) {
      return this.ready();
    }

    return Rooms.find({ owner: this.userId });
  });

  Meteor.publish('rooms.show', function(roomId) {
    
    console.log("RUNNING");

    const me = this;

    if (!me.userId || !roomId) {
      return me.ready();
    }

    const room = Rooms.findOne({ _id : roomId });

    if(!Rooms.userCanInteractWithRoom(me.userId, room)) {
      return me.ready();
    }

    Rooms.update({ _id : roomId }, {
      $addToSet : {
        "roomState.activeUsers" : me.userId
      }
    });

    me.onStop(function() {
      Rooms.update({ _id : roomId }, { 
        $pull : { "roomState.activeUsers" : me.userId }
      });
    });

    return Rooms.find({ _id: roomId });
  });

  Meteor.publish('rooms.find_one', function() {
    if (!this.userId) {
      return me.ready();
    }

    return Rooms.find({});
  });

  Meteor.publish('rooms.all', function() {
    if (!this.userId) {
      return me.ready();
    } 

    return Rooms.find({});
  });
} 

Meteor.methods({
  'rooms.insert' : (name) => {
    check(name, String);
    // Make sure the user is logged in before inserting a room
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const opts = {
      name        : name, 
      createdAt   : new Date(),
      owner       : Meteor.userId(),
      roomState : {
        playing     : false,
        activeUsers : []
      },
      guests      : [],
      userState   : {}
    }

    Rooms.schema.validate(opts);

    Rooms.insert(opts);
  },
  'rooms.destroy' : (id) => {
    check(id, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const room = Rooms.findOne(id);
    
    if(room.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized')
    }

    Rooms.remove(id);
  },
  'rooms.addActiveUser' : (roomId, userId) => {
      check(roomId, String);
      check(userId, String);
      
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized');
      }
      
      const selector = { _id : roomId }
      const room = Rooms.findOne(selector);
     
      // if(!Rooms.userCanInteractWithRoom(userId, room)) {
      //   throw new Meteor.Error('not-authorized');
      // }

      // console.log(room);

      // if(!room.roomState.activeUsers) {


      //   //Rooms.update({_id : roomId}, {roomState.activeUsers : []});
      // }
  }
});

module.exports.Rooms = Rooms;