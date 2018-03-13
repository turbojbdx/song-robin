UserStatus.events.on("connectionLogin", function(fields) { 
	// fields contains userId, connectionId, ipAddr, userAgent, and loginTime.
	//console.log(fields );
})

UserStatus.events.on("connectionLogout", function(fields) { 
	//fields contains userId, connectionId, lastActivity, and logoutTime.
	
})
	
UserStatus.events.on("connectionIdle", function(fields) {  
	//fields contains userId, connectionId, and lastActivity.
})


UserStatus.events.on("connectionActive", function(fields) { 
	//fields contains userId, connectionId, and lastActivity.
})