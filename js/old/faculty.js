function faculty(url) {

	var views = "partials/faculty/";
	var labtechs = {};
	$.get(url + 'user/', function(response) {
		$.each(response, function () {
			if ($.inArray(2, this.groups) != -1) {
				labtechs[this.id] = this.first_name + ' ' + this.last_name;
			}
		})
	});


	function populate_table() {
		var sort = 0;
		$.ajax({
			url: url + 'request/admin/',
			method: 'GET',
			dataType: 'JSON',
			beforeSend: function (request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(response) {
				$('#requestList').remove();
				$('#requestTable').append('<table class="table table-striped table-bordered tablesorter" cellspacing="0" cellpadding="0" id="requestList"><thead><tr><th>Due Date</th><th>Lab Tech</th><th>Request Type</th><th>Subject</th><th>Status</th><th>Accept</th></tr></thead><tbody></tbody></table>');
				for (i in response) {
					if (response[i].fields.request_status != 'Completed') {
						sort = 1;
						if (response[i].fields.request_status == 'Pending') {
							response[i].fields.modify = '<a href="#" id="acceptRequest" name="' + response[i].pk + '" class="btn btn-default">Accept</a>';
						} else {
							response[i].fields.modify = '<a href="#" id="completeRequest" name="' + response[i].pk + '" class="btn btn-default">Complete</a>';
						}
						$('#requestList > tbody').append('<tr><td>'+response[i].fields.due_date+'</td><td>'+labtechs[response[i].fields.labtech_Name]+'</td><td>'+response[i].fields.request_Type+'</td><td>'+response[i].fields.subject+'</td><td>'+response[i].fields.request_status+'</td><td>'+response[i].fields.modify+'</td></tr>');
					}

				}
				if (sort == 1) {
					$('#requestList').tablesorter({sortList: [[4,1], [0,0]]});
				};
				auth.populate_user_table();
			},

			error: function(response) {

			}
		});
	};

	this.requests = function() {
		$.get(views + 'requests.html', function(response) {
			$('#content').html(response);
			populate_table();
		});
		
	}

	this.addRequest = function() {
		var form = $('#requestForm').serializeArray();
		var data = {};
		for (i in form) {
			data[form[i].name] = form[i].value;
		}

		data.upload = "";

		$('#facultyRequests').modal('hide');
		$.ajax ({
			url: url + 'request/derp/',
			method: 'POST',
			data: data,
			beforeSend: function (request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(response) {
				populate_table();
				//

			},

			error: function(response) {

			}
		});
	}

	this.acceptRequest = function(id) {
		console.log(id);
		id = id[0];
		console.log(id);
		var data = {};
		data.id = id;
		data.labtech_Name = userId;
		data.request_status = "Approved";

		$.ajax({
			url: url + 'request/update/',
			method: 'POST',
			data: data,
			beforeSend: function(request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(response) {
				populate_table();
			},

			error: function(response) {

			},
			
		});

	};

	this.completeRequest = function(id) {
		var data = {};
		data.id = id;
		data.labtech_Name = userId;
		data.request_status = "Completed";

		$.ajax({
			url: url + 'request/update/',
			method: 'POST',
			data: data,
			beforeSend: function(request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(response) {
				populate_table();
			},

			error: function(response) {

			},
			
		});

	};
}