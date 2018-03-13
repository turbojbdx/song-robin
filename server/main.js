import { Meteor } from 'meteor/meteor';
import '../imports/api/users.js'
import '../imports/api/rooms.js'
import '../imports/api/room_messages.js'
import '../imports/api/invites.js'
import '../imports/startup/service-config.js'
import '../imports/startup/user-status-config.js'
import '../imports/startup/accounts-server-config.js'


Meteor.startup(() => { 
  Meteor.users._ensureIndex({ "tsearch": "text" });
});
