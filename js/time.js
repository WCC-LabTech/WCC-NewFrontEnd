var time = {
	views : 'partials/time/',
	current_period : 0,
	weekday : {
			0 : "Sunday",
			1 : "Monday",
			2 : "Tuesday",
			3 : "Wednesday",
			4 : "Thursday",
			5 : "Friday",
			6 : "Saturday",
	},
	categories : function() {
        var cats = time.config.ajax(time.config.url + 'category/', 'get', '', false);
 		cats.success(function(response) {
    	    time.cats = response;
	    });
        
	},
	populate_table : function() {
        time.categories();
        var sort = false;
		var payperiod = time.config.ajax(time.config.url + 'workevent/payperiod/' + time.current_period + '/', 'get');
		payperiod.success(function(response) {
			var html = "";
			var total = 0;
			var mins = 0;
			$('#workevents').remove();
			$('#workeventTable').append('<table class="table table-striped table-bordered tablesorter" cellspacing="0" cellpadding="0" id="workevents"><thead><tr><th>Date</th><th>Day</th><th>Category</th><th>Start</th><th>End</th><th>Hour\'s Worked</th><th>Modify Entry</th></tr></thead><tbody></tbody><tfoot><tr><td colspan="5" class="total">Total</td><td colspan="2" id="periodTotal"></td></tr><tr><td colspan="7"><a href="#addEntry" class="btn btn-primary btn-lg" data-toggle="modal">Add Entry</a></td></tr></tfoot></table>');

			for (i in response) {
                sort = true;
				var duration = response[i].duration.split(':');
				total += parseInt(duration[0]);
				mins += parseInt(duration[1]);
				if (mins >= 60) {
					mins -= 60;
					total += 1
				}
				var date = new Date(response[i].start_date);
				var day = time.weekday[date.getUTCDay()];
				var category = $.grep(time.cats, function(e) {return e.id == response[i].category});
				$('#workevents > tbody').append("<tr><td>" + response[i].start_date + "</td><td>" + day + "</td><td>" + category['0'].name + "</td><td>" + response[i].start + "</td><td>" + response[i].end + "</td><td>" + response[i].duration + "</td><td><button href='#updateEntry' class='btn btn-warning' name='?/time/updateForm/"+ response[i].id +"' id='modify' data-toggle='modal'>Modify</button> <a href='?/time/delete/" + response[i].id + "' class='btn btn-danger deleteButton'>Delete</button></td></tr>");
			}
			//$('#workevents > tbody').html(html);
			$('#periodTotal').html(total + ' Hours ' + mins + " Minutes");
            if (sort === true) {
    			$('#workevents').tablesorter({sortList: [[0,0], [3,0]]});
            }
			$('#loading').modal('hide');
			$('.modal-backdrop').remove();
		});
		payperiod.error(function(response)  {
			console.log(response);

		});
	},
	populate_categories : function() {
		$.getJSON(time.config.url + 'category/', function(response) {
			var options = $('#category');
			var options_update = $('#category_update');
            for (i in response) {
                if (response[i].is_project != true) {
                    options.append($("<option />").val(response[i].id).text(response[i].name));
                    options_update.append($("<option />").val(response[i].id).text(response[i].name));
                }
            }
     		options.append($("<optgroup />").attr('label', 'Projects'));
     		options_update.append($("<optgroup />").attr('label', 'Projects'));
     		
            for (i in response) {
                if (response[i].is_project == true) {
                    options.append($("<option />").val(response[i].id).text(response[i].name));
                    options_update.append($("<option />").val(response[i].id).text(response[i].name));
                }
            }
		});
	},
	main : function() {
		$.get(this.views + 'home.html', function(html) {
			$('#content').html(html);
			$.getJSON(time.config.url + 'payperiod/list/', function(data) {
				var periods = data.pay_periods;
				for (i in periods) {
					$('#payperiods > tbody').prepend('<tr><td><a href="?/time/period/' + periods[i].id + '" class="periodLink">' + periods[i].name + '</a></td><td>' + periods[i].start + '</td><td>' + periods[i].end + '</td></tr>');
				};
			});
		});
	},
	period : function(id) {
		this.current_period = id;
		$.get(this.views + 'period.html', function(html) {
			$('#content').html(html);
			time.populate_table();
			time.populate_categories();
		});
		
		time.populate_table();
		
	},
	addEntry : function() {
		console.log("BLAH");
        var form = $('#entryForm').serializeArray();
		var data = {};
		for (i in form) {
			data[form[i].name] = form[i].value;
		}
        if ($('#on_campus').prop('checked')) {
    		data.clocked_in = true;
        } else {
            data.clocked_in = false;
        }
		data = $.param(data);
		$('#addEntry').modal('hide');
        $('#entryForm').trigger('reset');
		var add = time.config.ajax(time.config.url + 'workevent/add/', 'post', data);
		add.success(function(response) {
				time.populate_table();	
			});
		add.error(function(response) {
                $('#loading').modal('hide');
                $('.modal-backdrop').remove();
				console.log('Error');
			});
	},
	delete : function(id) {
		$.post(time.config.url + 'workevent/delete/' + id + '/');

		time.populate_table();
	},
	update : function() {
		var id = $('#updateId').val();
		var form = $('#updateForm').serializeArray();
		var data = {};
		for (i in form) {
			data[form[i].name] = form[i].value;
		}
		//data.clocked_in = $('#on_campus_update').prop('checked');
        if ($('#on_campus_update').prop('checked')) {
            data.clocked_in = true;
        } else {
            data.clocked_in = false;
        }
        console.log(data);
		delete data.hour;
		delete data.minute;
		delete data.meridian;
		delete data.updateId;
		data = $.param(data);
		$('#updateEntry').modal('hide');
        $('#entryForm').trigger('reset');
		var update = time.config.ajax(time.config.url + 'workevent/update/' + id + '/', 'post', data);
		update.success(function(response) {
			time.populate_table();
		});
		update.error(function(response) {
            $('#loading').modal('hide');
            $('.modal-backdrop').remove();
			console.log('Error');
		});
	},
	updateForm : function(id) {
		$.getJSON(time.config.url + 'workevent/' + id + '/', function(response) {
			s = response.start_dt.split(/\D/);
			d = response.end_dt.split(/\D/);
            var s_date = new Date(s[0], --s[1], s[2], s[3], s[4]);
            var e_date = new Date(d[0], --d[1], d[2], d[3], d[4]);
            s_date.setHours(s_date.getHours() - 5);
            e_date.setHours(e_date.getHours() - 5);
			$('#category_update').val(response.category);
            $('#start_time_update').datetimepicker('setDate', s_date);
            $('#end_time_update').datetimepicker('setDate', e_date);
            $('#on_campus_update').prop('checked', response.clocked_in)
			$('#comments_update').val(response.comments);
			$('#updateId').val(id);
		});
	}
}
