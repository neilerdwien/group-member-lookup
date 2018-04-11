gadget.ready(function() {		

	// console.log("Gadget Log: ", gadget);

});

function augmentUserList(userList) {
	userList.forEach(function(user){
		user.email = lookupEmailByName(user.username);
		console.log(user.email);
	});
}

function lookupEmailByName(username) {
	const apiHost = gadget.apihost;
	const callData = {
		site: gadget.site,
		authorization_token: gadget.token,
		user: username
	};
    //var email = '1';
	
	return $.ajax({
		method: 'GET',
		url: apiHost + '/users/view',
		data: callData
	})
		.done(function (data) {
		//console.log(data);
		return data.email || '2';
	})
		.fail(function (err) {
		console.log(err);
	});
	
	//return email+"cat";
}

function lookupGroupByName(textFromInput) {
	const apiHost = gadget.apihost;
	const callData = {
		site: gadget.site,
		authorization_token: gadget.token,
		group: textFromInput
	};

	console.log("callData ",callData);

	$.ajax({
		method: 'GET',
		url: apiHost + '/groups/view',
		data: callData
	})
		.done(function (data) {
		augmentUserList(data.members);
		console.log("Augmented", data.members);
	})
		.fail(function (err) {
		console.log(err);
	});
}

$('#glg-button-lookup').on('click', function(evt) {

	let textFromInput = $('#glg-input-groupname').val();
	lookupGroupByName(textFromInput);

});