import { check } from 'meteor/check';

if(Meteor.isServer) {
	Meteor.publish('users.public', function() {
		const opts = {
			fields : {
				profile : 1
			}
		}

		return Meteor.users.find({}, opts);
	});


	Meteor.methods({
		'users.search'(text) {
			check(text, String);
			
			if (!Meteor.userId()) {
	      		throw new Meteor.Error('not-authorized');
	    	}

	    	const users = Meteor.users.find({ $text : { $search : text}}, { limit : 40}).fetch();	

	    	return users.filter(u => u._id !== Meteor.userId).map(u => {
	    		if(u.services.facebook) {
	    			return {
	    				value :  u.services.facebook.name,
	    				uid : u._id,
	    				name  : u.services.facebook.name, 
	    				email : u.services.facebook.email
	    			}
	    		}
	    		else if(u.services.password) {
	    			return {
	    				value : u.profile.name,
	    				uid : u._id,
	    				name  : "unknown",
	    				email : u.services.email
	    			}
	    		}
	    		else {
	    			return {
	    				value : "unknown",
	    				uid : u._id,
	    				name  : "unknown",
	    				email : "unknown"
	    			};
	    		}
	    	});
		}
	});
}