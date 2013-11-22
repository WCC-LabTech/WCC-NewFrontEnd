var inv = {
    inventory : {},
    partials : 'partials/inventory/',
      
    main : function() {
    	$.getJSON(inv.config.url + 'inventory/all/Computer/', function(response) {
        	inv.inventory = response;
        	console.log(inv.inventory); 
    	});
    },
    form : function() {
    	$.get(inv.partials + 'form.html', function(data) {
    		$('#content').html(data);
    	});
    },
    set : function() {
    	var form = $('#addInv').serializeArray();
        var data = {};
        for (i in form) {
            data[form[i].name] = form[i].value;
        }
        data = $.param(data);
        var set = inv.config.ajax(inv.config.url + 'inventory/set/Hard_drive/', 'post', data);
        set.success(function() {
        	console.log('Success');

        	$('#loading').modal('hide');
            $('.modal-backdrop').remove();
        });
    }


}

