import { ServiceConfiguration } from 'meteor/service-configuration';

// todo change these vars to env vars
const services = {
	"facebook" : {
		loginStyle : "popup",
		clientId   : "268322130357090",
      	secret     : "037293a8c9005bad00851f21a127b321"
	}
}

for(let service in services) {
	let serv = { service : service };
	let set  = {
		$set: {
      		loginStyle: "popup",	
      		appId: "268322130357090",
      		secret: "037293a8c9005bad00851f21a127b321"
    	}
	}

	ServiceConfiguration.configurations.upsert(serv, set);
}

module.exports = true;