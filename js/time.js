function time(url) {
	var views = 'partials/time/';
	var current_period;
	var weekday=new Array(7);
		weekday[0]="Sunday";
		weekday[1]="Monday";
		weekday[2]="Tuesday";
		weekday[3]="Wednesday";
		weekday[4]="Thursday";
		weekday[5]="Friday";
		weekday[6]="Saturday";

	this.url = url;
	var categories;
	$.get(url + 'category/', function(response) {
		categories = response;
	});

	function populate_table() {
		$.ajax({
			url: url + 'workevent/payperiod/' + current_period + '/',
			method: 'GET',
			dataType: 'JSON',
			beforeSend: function (request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(response) {
				var html = "";
				var total = 0;
				var mins = 0;
				$('#workevents').remove();
				$('#workeventTable').append('<table class="table table-striped table-bordered tablesorter" cellspacing="0" cellpadding="0" id="workevents"><thead><tr><th>Date</th><th>Day</th><th>Category</th><th>Start</th><th>End</th><th>Hour\'s Worked</th><th>Modify Entry</th></tr></thead><tbody></tbody><tfoot><tr><td colspan="5" class="total">Total</td><td colspan="2" id="periodTotal"></td></tr><tr><td colspan="7"><a href="#addEntry" class="btn btn-primary btn-lg" data-toggle="modal">Add Entry</a></td></tr></tfoot></table>');
	
				for (i in response) {
					var duration = response[i].duration.split(':');
					total += parseInt(duration[0]);
					mins += parseInt(duration[1]);
					if (mins >= 60) {
						mins -= 60;
						total += 1
					}
					var date = new Date(response[i].start_date);
					var day = weekday[date.getUTCDay()];
					var category = $.grep(categories, function(e) {return e.id == response[i].category});
					$('#workevents > tbody').append("<tr><td>" + response[i].start_date + "</td><td>" + day + "</td><td>" + category['0'].name + "</td><td>" + response[i].start + "</td><td>" + response[i].end + "</td><td>" + response[i].duration + "</td><td><button href='#updateEntry' class='btn btn-default' name='"+ response[i].id +"' id='modify' data-toggle='modal'>Modify</button><button class='btn btn-default' name='"+ response[i].id +"' id='delete'>Delete</button></td></tr>");
				}
				//$('#workevents > tbody').html(html);
				$('#periodTotal').html(total + ' Hours ' + mins + " Minutes");
				$('#workevents').tablesorter({sortList: [[0,0], [3,0]]});
			},

			error: function(response)  {
				console.log(response);

			}
		})
	}

	function populate_categories() {
		$.get(url + 'category/', function(response) {
			var options = $('#category');
			var options_update = $('#category_update');
			$.each(response, function () {
				if (this.is_project != true) { 
         			options.append($("<option />").val(this.id).text(this.name));
         			options_update.append($("<option />").val(this.id).text(this.name));
         		}
     		});
     		options.append($("<optgroup />").attr('label', 'Projects'));
     		options_update.append($("<optgroup />").attr('label', 'Projects'));
     		$.each(response, function () {
				if (this.is_project == true) { 
         			options.append($("<option />").val(this.id).html("&nbsp;&nbsp;&nbsp;&nbsp;"+this.name));
         			options_update.append($("<option />").val(this.id).html("&nbsp;&nbsp;&nbsp;&nbsp;"+this.name));
         		}
     		});

		})
	}

	this.main = function() {
		$.get(views + 'home.html', function(html) {
			$('#content').html(html);
			
			$.getJSON(url + 'payperiod/list/', function(data) {
				var periods = data.pay_periods;
				for (i in periods) {
					$('#payperiods > tbody').prepend('<tr><td><a href="#" class="periodLink" name="' + periods[i].id + '">' + periods[i].name + '</a></td><td>' + periods[i].start + '</td><td>' + periods[i].end + '</td></tr>');
				};
			});
		});
	};

	this.period = function(id) {
		current_period = id;
	
		$.get(views + 'period.html', function(html) {
			$('#content').html(html);
			populate_table();
			populate_categories();
		});
		
		populate_table();
	};

	this.addEntry = function() {
		var form = $('#entryForm').serializeArray();
		var data = {};
		for (i in form) {
			data[form[i].name] = form[i].value;
		}
		data.clocked_in = $('#on_campus').prop('checked');
		data = $.param(data);
		$('#addEntry').modal('hide');
		$.ajax({
			url: url  + 'workevent/add/',
			method: 'POST',
			data: data,
			beforeSend: function (request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(response) {
				populate_table();			
			},

			error: function(response) {
				console.log('Error');
			}
		})
	}

	this.update = function(id) {
		var form = $('#updateForm').serializeArray();
		var data = {};
		for (i in form) {
			data[form[i].name] = form[i].value;
		}
		data.clocked_in = $('#on_campus_update').prop('checked');
		delete data.hour;
		delete data.minute;
		delete data.meridian;
		data = $.param(data);
		$('#updateEntry').modal('hide');
		$.ajax({
			url: url + 'workevent/update/' + id + '/',
			method: 'POST',
			data: data,
			beforeSend: function (request) {
				request.setRequestHeader("AUTHENTICATE", token);
			},

			success: function(response) {
				populate_table();
				
				
				
			},

			error: function(response) {
				console.log('Error');
			}
		});

	}

	this.delete = function(id) {
		$.post(url + 'workevent/delete/'+id+'/');

		populate_table();
	}
};
