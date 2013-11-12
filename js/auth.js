var auth = {
	login : function() {
		var username = $('#username').val();
		var password = $('#password').val();
        var data = {};
        data.username = username;
        data.password = password;
        data = $.param(data);
        $('#loading').modal('show');
        $.ajax({
        	url: this.config.url + 'auth/login/',
        	method: 'POST',
        	data: data,
        	dataType: 'json',

        	success: function(response) {
        		auth.config.userId = response.id;
        		auth.config.token = response.token;
        		auth.config.loggedIn = true;
        		localStorage['userId'] = auth.config.userId;
				localStorage['token'] = auth.config.token;
				localStorage['loggedIn'] = auth.config.loggedIn;
        		
                auth.loggedIn();
        	},
        	error: function(data) {
        		console.log(data.status);
        		if (data.status == 403) {
        			$('#loginError').html("Invalid Username / Password");
        		}
        		$('#loading').modal('hide');
				$('.modal-backdrop').remove();
        	}
        });
	},
    logout : function() {
        localStorage['userId'] = null;
        localStorage['token'] = null;
        localStorage['loggedIn'] = null;
        auth.config.token = null;
        auth.config.userId = 0;
        auth.config.loggedIn = false;
        window.location.replace('http://bosapp.wccnet.edu');
    },
	loggedIn : function() {
		var getUser = auth.config.ajax(auth.config.url + 'user/' + auth.config.userId + '/', 'get');
		getUser.success(function(data) {
            user = data.first_name + " " + data.last_name;
			auth.config.user = user;
			$('#forgotPassword').remove();
			var html = auth.config.user;
			var element = $('#user');
			element.children('h3').html(html);
			$('#login').hide();
			element.show();
			var nav = $('nav');
			var html = '<ul class="nav navbar-nav navbar-right"><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">My Requests <span id="requestBadge" class="badge"></span> <b class="caret"></b></a><ul class="dropdown-menu"><div id="myRequests" class="panel visible-lg userList"></div></ul></li></ul>';
			nav.children('.collapse').append(html);
			auth.populate_user_table();
			for (i in data.groups) {
				auth.access(data.groups[i]);
			}
		});
	},
	access : function(id) {
		if (id == 1) {

		}
		if (id == 2) {
		
		}
		if (id == 3) {
			var faculty = $('#facultyReq');
			var html = '<a href="" class="dropdown-toggle" data-toggle="dropdown">Faculty Requests <b class="caret"></b></a><ul class="dropdown-menu"><li><a href="?/faculty/requests" id="requests">View Requests</a></li><li><a href="#facultyRequests" id="faculty" data-toggle="modal">Submit a Request</a></li></ul>';
			faculty.attr('class', 'dropdown');
			faculty.html(html);
			$('#facultyName').html(auth.config.user);
			$('#faculty_Name').val(auth.config.userId);
			$.get(auth.config.url + 'user/', function(response) {
				var options = $('#labtech_Name');
                options.append($('<option />').val("").text("No Preference"));
				$.each(response, function () {
					if ($.inArray(2, this.groups) != -1) { 
         				options.append($("<option />").val(this.id).text(this.first_name + ' ' + this.last_name));
         			}
     			});
			});
			
		}
		if (id == 4) {
			var nav = $('nav');
			var html = '<ul class="nav navbar-nav navbar-right"><li id="admin" class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown">Admin <b class="caret"></b></a><ul class="dropdown-menu"><li><a href="?/admin/main" id="payrollLink">Payroll</a></li><li><a href="#" id="reports">Reports</li><li><a href="?/lotto/main">Lotto Admin</a></li><li><a href="?/admin/email">Email</li></ul></li></ul>';
			nav.children('.collapse').append(html);
			
		}
	},
	populate_user_table : function() {
		var requestTable = auth.config.ajax(auth.config.url + 'request/user/' + auth.config.userId + '/', 'get');
		requestTable.success(function(response) {
			response = response.requests;
			$('#userList').remove();
			$('#myRequests').append('<table class="table table-striped table-bordered tablesorter" cellspacing="0" cellpadding="0" id="userList"><thead><tr><th>Due</th><th>Subject</th><th>Actions</th></tr></thead><tbody></tbody></table>');
			var badge = 0;
			for (i in response) {
				if (response[i].request_status != 'Completed') {
					if (response[i].request_status == 'Pending') {
							response[i].modify = '<a href="?/faculty/acceptRequest/' + response[i].pk +'" id="acceptRequest" class="btn btn-default">Accept</a>';
							badge += 1;
						} else {
							response[i].modify = '<a href="?/faculty/completeRequest/' + response[i].pk +'" id="completeRequest" class="btn btn-default">Complete</a>';
						}
					$('#userList > tbody').append('<tr><td>'+response[i].due_date+'</td><td>'+response[i].subject+'</td><td>'+response[i].modify+'</td></tr>');
				}
			}
			if (badge > 0) {
				$('#requestBadge').html(badge);
			} else {
				$('#requestBadge').html('');
			};
			$('#loading').modal('hide');
			$('.modal-backdrop').remove();
		});
		requestTable.error(function(response) {

		});
	},
	recovery : function() {
		var data = {};
		data.username = $('#username_reset').val();
		data = $.param(data);
		$.post(auth.config.url + 'password/request_link/', data, function() {
			$('#recoverErrorMsg').html('A link has been sent to your email address to reset your password');
			$('#recoverSubmit').remove();
		});
	},
	resetForm: function(rstToken) {
		auth.rstToken = rstToken;
		$('#passwordReset').modal('show');
	},
	pwrdReset : function() {
		var data = {};
		data.link = auth.rstToken[0];
		data.password = $('#password_reset').val();
		var confirm = $('#confirm_reset').val();
		if (data.password == confirm) {
			data = $.param(data);
			$.post(auth.config.url + 'password/reset/', data, function() {
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
}
