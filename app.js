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
		site: gadget.site,
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

var template = '';
var groupTable;

function getMessage(group) {
	
	var msg, userlist;
	
	if (!groupTable[group]) {
		return "Group '" + group + "' not found.";
	}
	userlist = [];
	
	groupTable[group].forEach(function(u) {
		userlist.push("   " + u.u_firstname + " " + u.u_lastname + '(' + u.u_email + ')');
	})
		
	msg = template.replace(/{{userlist}}/, userlist.join("<br />")).replace(/\n/, "<br />");
	return msg;
}

$('#glg-button-lookup').on('click', function(evt) {

	let textFromInput = $('#glg-input-groupname').val();
	
	console.log(groupTable);
	console.log(template);
	
	var msg = getMessage(textFromInput);
	console.log(msg);
    $('#glg-message-provision').html(msg);

});