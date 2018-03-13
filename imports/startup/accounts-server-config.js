require("colors");

Accounts.validateNewUser((user) => {
	let errors = [];

	if(user.services.password) {
		if(user.profile.first_name.length <= 2) {
			errors.push({
				first_name : "First Name is required"
			})
		}

		if(user.profile.last_name.length <= 2) {
			errors.push({
				last_name : "Last Name is required"
			})
		}

		if(errors.length) {
			throw new Meteor.Error(403, JSON.stringify(errors));
		}
	}

	return true;
});

Accounts.onCreateUser((options, user) => {
	console.log("Run Accounts.onCreateUser".cyan);
	let tsearch;
	let extras = {};

	if(user.services) {
		if(user.services.facebook) {
			tsearch = `${user.services.facebook.name} ${user.services.facebook.email}`
		}
		else if(user.services.password) {
			tsearch   = `${user.emails.map(e => e.address).join('')} ${options.first_name} ${options.last_name}`
			extras.first_name = options.first_name;
			extras.last_name  = options.last_name;
		}

		extras.tsearch = tsearch;
	}

	const customizedUser = Object.assign({tsearch : tsearch}, user);

  	if(options.profile) {
    	customizedUser.profile = options.profile;
  	}
  	else {
  		let profile = {
  			first_name : extras.first_name,
  			last_name : extras.last_name,
  			name : `${extras.first_name} ${extras.last_name}`
  		}
  		customizedUser.profile = profile;
  	}

  	return customizedUser;
});