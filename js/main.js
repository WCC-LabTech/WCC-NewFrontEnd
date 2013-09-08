var url = "http://home.cspuredesign.com:8080/";


var time = new time(url);
var fac = new faculty(url);
var inv = new inv(url);
var admin = new admin(url);
var auth = new auth(url);


$(document).on('submit', '#loginForm', function() {
	auth.login($('#username').val(), $('#password').val());
	return false;
});

$('#logout').click(function() {
	auth.logout();
	return false;
});

$('#time').click(function() {
	if ($('.navbar-toggle').is(":visible")) {
		$('.navbar-toggle').click();
	}
	time.main();
	return false;

});

$(document).on('click', '.periodLink', function() {
	var id = $(this).attr('name');
	time.period(id);

	return false;
});

$(document).on('submit', '#entryForm', function() {
	time.addEntry();

	return false;
});

$(document).on('click', '#modify', function() {
	var id = $(this).attr('name');
	$.get(url + 'workevent/' + id + '/', function(response) {
		$('#category_update').val(response.category);
		$('#start_date_update').val(response.start_date);
		$('#start_time_update').children('input').val(response.start);
		$('#end_time_update').children('input').val(response.end);
		$('#on_campus_update').val(response.clocked_in);
		$('#comments_update').val(response.comments);
		$('#updateId').val(id);

	});
});

$(document).on('click', '#timeUpdate', function() {
	var id = $('#updateId').val();
	time.update(id);

	return false;
})

$(document).on('click', '#delete', function() {
	var id = $(this).attr('name');
	time.delete(id);

	return false;
});

$(document).on('click', '#faculty', function() {
	if ($('.navbar-toggle').is(":visible")) {
		$('.navbar-toggle').click();
	}
	return false;
});

$(document).on('click', '#requests', function() {
	if ($('.navbar-toggle').is(":visible")) {
		$('.navbar-toggle').click();
	}
	$('#facultyReq').click();
	fac.requests();
	
	return false;
});

$(document).on('submit', '#requestForm', function() {
	fac.addRequest();

	return false;
});

$(document).on('click', '#acceptRequest', function() {
	var id = $(this).attr('name');
	fac.acceptRequest(id);

	return false;
});

$(document).on('click', '#completeRequest', function() {
	var id = $(this).attr('name');
	fac.completeRequest(id);

	return false;
});
$(document).on('click', '#inventory', function() {
    inv.main();

    return false;
});




$(document).on('click', '#reports', function() {
	admin.main();
	$('#admin').click();

	return false;
});
$(document).on('click', '.periodAdmin', function() {
	var id = $(this).attr('name');
	admin.payroll(id);

	return false;
});
