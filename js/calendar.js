var cal = {
	api: 'http://bosapp-dev.wccnet.edu/staffing_app/public/',
	partials: 'partials/calendar/',
	token: 'xzReHGMhWG5YSsNiDWgIczkHbEUPijAfWTc0LIf2',
    main: function() {
    	$.get(cal.partials + 'home.html', function(data) {
            $('#content').html(data);
        });
    },
    formatDate: function(date) {
    	var year = date.getFullYear();
    	var month = date.getMonth() + 1;
    	var day = date.getDate();

    	return year + '-' + month + '-' + day;
    },
    update: function(data) {
    	data._token = cal.token;
    	var update = $.post(cal.api + 'events/update', data);
    	update.success(function(msg) {
    		console.log(msg);
    	}).error(function(msg) {
    		console.log(msg);
    	});
    },
    addEvent: function() {
    	var data = $('#eventForm').serializeArray();
    	console.log(data);
    	var add = $.post(cal.api + 'events/add', data);
    	add.success(function(res) {
    		console.log(res);
    		cal.main();
    		$('#loading').modal('hide');
			$('.modal-backdrop').remove();
    	}).error(function(res) {
    		console.log(res);
    	});

    }
}
