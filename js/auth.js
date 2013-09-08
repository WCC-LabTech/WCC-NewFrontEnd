function auth(url) {

	//var url = "http://10.0.0.3:8080/";
	var token;
	var userId;
	this.token = null;
	this.userId = null;
	var user;

	this.login = function(username, password) {
		var api = "auth/login/"
		var data = {};
		data.username = username;
		data.password = password;
		data = $.param(data);
		that = this;
		$.ajax({
			url: url + api,
			method: "POST",
			data: data,
			dataType: 'json',
			
			success: function(data) {
				setVariables(data);
				loggedIn(data.id);
				
				$.cookie('userId', data.id);
				localStorage['userId'] = data.id;
				$.cookie('token', data.token);
				localStorage['token'] = data.token;
				
			},
			error: function(data) {
				console.log(data.status);
				if (data.status == 403) {
					$('#loginError').html("Invalid Username / Password");
				}
			}
		});

	}

	this.logout = function() {
		$.ajax({
			url: url + 'auth/logout/',
			method: 'GET',
			beforeSend: function (request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(data) {
				$.cookie('userId', null);
				$.cookie('token', null);
				localStorage['userId'] = null;
				localStorage['token'] = null
				$('#user').hide();
				$('#login').show();
				location.reload();
			},

			error: function(data) {
				$.cookie('userId', null);
				$.cookie('token', null);
				localStorage['userId'] = null;
				localStorage['token'] = null
				$('#user').hide();
				$('#login').show();
				location.reload();

			}
		});
	}

	this.populate_user_table = function() {		
			$.ajax({
				url: url + 'request/user/' + userId + '/',
				method: 'GET',
				dataType: 'JSON',
				beforeSend: function (request) {
					request.setRequestHeader("AUTHENTICATE", token);
				},

				success: function(response) {
					response = response.requests;
					$('#userList').remove();
					$('#myRequests').append('<table class="table table-striped table-bordered tablesorter" cellspacing="0" cellpadding="0" id="userList"><thead><tr><th>Due</th><th>Subject</th><th>Actions</th></tr></thead><tbody></tbody></table>');
					var badge = 0;
					for (i in response) {
						if (response[i].request_status != 'Completed') {
							if (response[i].request_status == 'Pending') {
									response[i].modify = '<a href="#" id="acceptRequest" name="' + response[i].pk + '" class="btn btn-default">Accept</a>';
									badge += 1;
								} else {
									response[i].modify = '<a href="#" id="completeRequest" name="' + response[i].pk + '" class="btn btn-default">Complete</a>';
								}
							$('#userList > tbody').append('<tr><td>'+response[i].due_date+'</td><td>'+response[i].subject+'</td><td>'+response[i].modify+'</td></tr>');
						}
					}
					if (badge > 0) {
						$('#requestBadge').html(badge);
					} else {
						$('#requestBadge').html('');
					};
				},

				error: function(response) {

				}
			});
		};

	this.recovery = function() {
		var data = {};
		data.username = $('#username_reset').val();
		data = $.param(data);
		$.post(url + 'password/request_link/', data, function() {
			$('#recoverErrorMsg').html('A link has been sent to your email address to reset your password');
			$('#recoverSubmit').remove();
		});
	}

	this.reset = function() {
		var data = {};
		data.link = querystring('link');
		data.password = $('#password_reset').val();
		var confirm = $('#confirm_reset').val();
		if (data.password == confirm) {
			data = $.param(data);
			$.post(url + 'password/reset/', data, function() {
				$('#errorMsg').html('Your password has been updated. This page will refresh in 5 seconds.');
				$('#resetSubmit').remove();

				setTimeout(function() {
					window.location.replace("http://bosapp.wccnet.edu");
				}, 5000);
			});

		} else {
			$('#errorMsg').html('Passwords do not match');
		}

	}

	if ($.cookie('userId') && $.cookie('userId') !== 'null') {
		data = {};
		data.token = $.cookie('token');
		data.id = $.cookie('userId');
		setVariables(data);
		loggedIn($.cookie('userId'));
	} else if (localStorage['userId'] && localStorage['userId'] !== 'null') {
		data = {};
		data.token = localStorage['token'];
		data.id = localStorage['userId'];
		setVariables(data);
		loggedIn(localStorage['userId']);
	};
	var empty = [];
	if (querystring('link').length !== 0) {
		$('#passwordReset').modal('show');
	}
	var that = this;

	function setVariables(data) {
		token = data.token;
		userId = data.id;
		this.token = data.token;
		this.userId = data.id;
		time.token = data.token;
		time.userId = data.id;
		fac.token = data.token;
		fac.userId = data.id;
		admin.token = data.token;
		admin.userId = data.id;
        inv.token = data.token;
        inv.userId = data.id;
	}

	function querystring(key) {
	   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
	   var r=[], m;
	   while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
	   return r;
	}

	function loggedIn(id) {
		userId = id;

		$.ajax({
			url: url +  'user/' + id + '/',
			method: 'GET',
			beforeSend: function (request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(data) {
				this.user = data.first_name + " " + data.last_name;
				user = this.user;
				$('#forgotPassword').remove();
				var html = this.user;
				var element = $('#user');
				element.children('h3').html(html);
				$('#login').hide();
				element.show();
				var nav = $('nav');
				var html = '<ul class="nav navbar-nav navbar-right"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">My Requests <span id="requestBadge" class="badge"></span> <b class="caret"></b></a><ul class="dropdown-menu"><div id="myRequests" class="panel visible-lg userList"></div></ul></li></ul>';
				nav.children('.collapse').append(html);
				that.populate_user_table();
				for (i in data.groups) {
					access(data.groups[i]);
				}
			}
		});
	}

	function access(id) {
		if (id == 1) {

		}
		if (id == 2) {
		
		}
		if (id == 3) {
			var faculty = $('#facultyReq');
			var html = '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Faculty Requests <b class="caret"></b></a><ul class="dropdown-menu"><li><a href="#" id="requests">View Requests</a></li><li><a href="#facultyRequests" id="faculty" data-toggle="modal">Submit a Request</a></li></ul>';
			faculty.attr('class', 'dropdown');
			faculty.html(html);
			$('#facultyName').html(user);
			$('#faculty_Name').val(userId);
			$.get(url + 'user/', function(response) {
				var options = $('#labtech_Name');
				$.each(response, function () {
					if ($.inArray(2, this.groups) != -1) { 
         				options.append($("<option />").val(this.id).text(this.first_name + ' ' + this.last_name));
         			}
     			});
			});
			
		}
		if (id == 4) {
			var nav = $('nav');
			var html = '<ul class="nav navbar-nav navbar-right"><li id="admin" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Admin <b class="caret"></b></a><ul class="dropdown-menu"><li><a href="#" id="reports">Time Tracking</a></li></ul></li></ul>';
			nav.children('.collapse').append(html);
			
		}
	}

}
