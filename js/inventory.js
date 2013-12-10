var inv = {
    inventory : {},
    partials : 'partials/inventory/',
      
    main : function() {
    	$.get(inv.partials + 'home.html', function(data) {
            $('#content').html(data);
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
    },
    get : function(type) {
        if (type === null) {
            type = 'all';
        }

        var equip = inv.config.ajax(inv.config.url + 'inventory/all/' + type +'/');
        equip.success(function(data) {
            var list = $('#accordion');
            list.empty();
            for (i in data) {
                var html = '<div class="panel panel-default"><div class="panel-heading">';
                html += '<h2 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#'+i+'">' + data[i].machine_name +' - ' + data[i].IS + '</a>';
                if (data[i]['in_use']) {
                        html += '<span class="label label-success pull-right">In Use</span>';
                    } else {
                        html += '<span class="label label-danger pull-right">Not In Use</span>';
                    }
                html += '</h2>';
                html += '</div><div id="'+i+'" class="panel-collapse collapse"><div class="panel-body">';
                var count = 0;
                html += '<div class="row">';
                for (j in data[i]) {
                    console.log(data[i]);
                    console.log(j + ' - ' + JSON.stringify(data[i][j]));
                    if (j == 'machine_name' || j == 'id' || j == 'in_use' || j == 'IS') {continue;}
                    if (count % 6 == 0) {
                        if (count !== 0) { html += '</div>';}
                        html += '<div class="col-lg-4">';
                    }
                    html += '<ul class=""><li class="">' + inv.formatName(j) + '</li>';
                    if (typeof data[i][j] == 'array' || typeof data[i][j] == 'object' && data[i][j].length > 0) {
                        html += '<div class="invStats">';
                        html += inv.itemStats(j, data[i][j]);
                        html += '</div>';
                    }
                    html += '</ul>';

                    count++;
                }

                html += '</div></div></div>';

                list.append(html);
            }

            $('#loading').modal('hide');
            $('.modal-backdrop').remove();

        });
    },
    formatName : function(name) {
        return name.split('_').join(' ');
    },
    itemStats : function(type, item) {
        var ret = '';
        //console.log(type);
        if (item.length > 1) {
            for (i in item) {
                ret += inv.itemStats(type, item[i]);
            }
        } else {
            switch(type) {
                case 'Hard_drive':
                    ret += '<div class="group">';
                    ret += '<div class="name">Storage: </div>';
                    ret += '<div class="value">'+item.total_GB+' GB</div>';
                    ret += '</div>';
                    if (typeof item.model == 'object') {
                        ret += '<div class="group">';
                        ret += '<div class="name">Model: </div>';
                        ret += '<div class="value">'+item.model.name+'</div>';
                        ret += '</div>';
                    }
                    break;

                case 'Motherboard':
                    if (typeof item.model == 'object') {
                        ret += '<div class="group">';
                        ret += '<div class="name">Model: </div>';
                        ret += '<div class="value">'+item.model.name+'</div>';
                        ret += '</div>';
                    }
                    break;
                case 'RAM':
                    ret += '<div class="group">';
                    ret += '<div class="name">Memory: </div>';
                    ret += '<div class="value">'+item.size_in_gigs+' GB</div>';
                    ret += '</div>';

                    break;
            }
        }
        return ret;
    }

}

