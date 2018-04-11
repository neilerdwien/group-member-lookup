'use strict';

gadget.ready(function() {		

	getData();
	getTemplate();

});

function buildGroupTable(records) {
	
	var obj = {};
	
	records.forEach(function(row) {
		var groups = row.u_groupmembership.split(/\s*,\s*/);
		groups.forEach(function(g) {
			obj[g] = obj[g] || [];
			obj[g].push(row);
		});
	});
	
	return obj;
}

function getData() {
	const apiHost = gadget.apihost;
	const callData = {
		authorization_token: gadget.token,
		all: "true",
		report: "users",
		u_username: "on",
		u_lastname: "on",
		u_firstname: "on",
		u_email: "on",
		u_groupmembership: "on"
	};
	
	//console.log("callData ",callData);

	$.ajax({
		method: 'GET',
		url: apiHost + '/reports',
		data: callData
	})
		.done(function (data) {
		
		//console.log("Big data", data);
		groupTable = buildGroupTable(data.records);
		//console.log(groupTable);

	})
		.fail(function (err) {
		console.log(err);
	});
}


function getTemplate() {
	const apiHost = gadget.apihost;
	
	//console.log("callData ",callData);

	$.ajax({
		method: 'GET',
		url: 'message.txt'
	})
	.done(function (data) {
		
		template = data;

	})
		.fail(function (err) {
		console.log(err);
	});
}

var group;
var template = '';
var groupTable;

function getMessage(group) {
	
	var msg, userlist;
	
	if (!groupTable) {
		return "Group information not loaded.";
	}
	
	if (!groupTable[group]) {
		return "Group '" + group + "' not found.";
	}
	userlist = [];
	
	groupTable[group].forEach(function(u) {
		userlist.push('<li>' + u.u_firstname + " " + u.u_lastname + ' (' + u.u_email + ')</li>');
	})
		
	msg = template.replace(/{{userlist}}/, '<ul>' + userlist.join("") + '</ul>').replace(/\n/, "<br />");
	return msg;
}

function sendMessage(group, msg) {
	const apiHost = gadget.apihost;
	const callData = {
		authorization_token: gadget.token,
		subject: "Your new site",
		text: msg,
		send_email: true,
		group: group,
		site: gadget.site,
		account: gadget.account
	};
	
	console.log('Sending', group, msg);
	
	$.ajax({
		method: 'POST',
		url: apiHost + '/messages/new',
		data: callData
	})
		.done(function (data) {
		
		$('#glg-message-provision').html("Message sent.");

	})
		.fail(function (err) {
		console.log(err);
	});

}


$('#glg-button-lookup').on('click', function(evt) {

	group = $('#glg-input-groupname').val();
	
	//console.log(groupTable);
	//console.log(template);
	
	var msg = getMessage(group);
	//console.log(msg);
    $('#glg-message-provision').html(msg);

});

$('#glg-button-submit').on('click', function(evt) {

	console.log("Sending", evt);
	let msg = $('#glg-message-provision').html();
	
	if (!msg) {
		return;   // Nothing to send
	}
	
	sendMessage(group, msg);

});