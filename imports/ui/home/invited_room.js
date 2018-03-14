import { Template } from 'meteor/templating'; 

import '../../api/rooms.js'
import './invited_room.html'

Template.invited_room.onCreated(function invitedRoomsCreated() {});

Template.invited_room.events({});