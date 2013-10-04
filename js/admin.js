var admin = {
    views : 'partials/reports/',
    main : function() {
       $.get(admin.views + 'periods.html', function(html) {
            $('#content').html(html);

            $.getJSON(admin.config.url + 'payperiod/list/', function(data) {
                var periods = data.pay_periods;
                for (i in periods) {
                    $('#payperiods > tbody').prepend('<tr><td><a href="?/admin/payroll/' + periods[i].id + '" class="periodAdmin" name="' + periods[i].id + '">' + periods[i].name + '</a></td><td>' + periods[i].start + '</td><td>' + periods[i].end + '</td></tr>');
                };
            });
        });
 
    },
    payroll : function(period) {
         $.getJSON(admin.config.url + 'payperiod/list/', function(periods) {
            var periods = periods.pay_periods;
            payperiod = $.grep(periods, function(e) {return e.id == period});
            start_date = new Date(payperiod[0].start + "T04:00:00Z");
            $.get(admin.views + 'home.html', function(html) {
                $('#content').html(html);
                $.getJSON(admin.config.url + 'report/workevent/payperiod/' + period + '/', function(response) {
                    var html = admin.payroll_table(response, start_date);
                    $('#payroll').html(html);
                    $('#payrollTable').tablesorter({sortList: [[0,0]]});
                });
            });
        });

    },
    payroll_table : function(data, s_date) {
         var html = '<table class="table table-striped table-bordered tablesorter" cellspacing="0" cellpadding="0" id="payrollTable">\
                        <thead>\
                            <tr>\
                                <th width="175px">Employee</th>\
                                <th colspan="7"></th>\
                            </tr>\
                        </thead>\
                        <tbody>';
        var begM = s_date.getUTCMonth() + 1;
        var begD = s_date.getUTCDate();
        var begY = s_date.getUTCFullYear();
        var begDate = begM + '/' + begD + '/' + begY;

        for (i in data) {
            var show = false;
            var hide = false;
            for (j in data[i].user.groups) {
                if (data[i].user.groups[j] > 2) {
                    hide = true;
                } else {
                    show = true;
                }
            }
            if (hide == true && show == false) {
                continue;
            }
            html += '<tr>\
                        <td><a href="mailto:' + data[i].user.email + '">' + data[i].user.last_name + ', ' + data[i].user.first_name + '</a></td>\
                        <td colspan="7">\
                            <table class="table table-striped" id="payroll_dates">\
                                <thead>\
                                    <tr>\
                                        <th width="6.5%"></th>\
                                        <th width="13.35%">Sat</th>\
                                        <th width="13.35%">Sun</th>\
                                        <th width="13.35%">Mon</th>\
                                        <th width="13.35%">Tue</th>\
                                        <th width="13.35%">Wed</th>\
                                        <th width="13.35%">Thur</th>\
                                        <th width="13.35%">Fri</th>\
                                    </tr>\
                                </thead>\
                                <tbody>\
                                    <tr>\
                                        <td>'+ begDate + '</td>';
            var comments = '<div class="accordion" id="accordion2"><div class="accordion-group"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion2" href="#collapse' + data[i].user.id + '">Comments</a></div><div id="collapse' + data[i].user.id + '" class="accordion-body collapse"><div class="accordion-inner">';
            var events = data[i].events;
            var y = 7;
            var day = new Date(s_date);
            while (y--) {
                html += '<td>';
                for (x in events) {
                    var date = day.getFullYear() + '-' + ('0' + parseInt(day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);

                    if (events[x].start_date == date) {
                        if (events[x].clocked_in != true) {
                            html += '<span class="highlight">';
                        } else {
                            html += '<span>';
                        }
                        //html += start_time['0'] + ':' + start_time['1'] + ' ' + stime + ' - ' + end['0'] + ':' + end['1'] + ' ' + etime + '</span><br />';
                        html += events[x].start + ' - ' + events[x].end + '<br />';
                        comments += events[x].start_date + ': ' + events[x].comments + '<br />';
                    }
                }
                day.setDate(day.getDate()+1);
                html += '</td>';
            }
            var e_date = new Date(s_date);
            e_date.setDate(s_date.getDate() + 7);
            var endM = e_date.getUTCMonth() + 1;
            var endD = e_date.getUTCDate();
            var endY = e_date.getUTCFullYear();
            var endDate = endM + '/' + endD + '/' + endY;
            html += '</tr><tr><td>' + endDate + '</td>';
            y = 7;
            while (y--) {
                html += '<td>';
                for (x in events) {
                    var date = day.getFullYear() + '-' + ('0' + parseInt(day.getMonth() + 1)).slice(-2) + '-' + ('0' + day.getDate()).slice(-2);
                    if (events[x].start_date == date) {
                        if (events[x].clocked_in != true) {
                            html += '<span class="highlight">';
                        } else {
                            html += '<span>';
                        }

                        //html += start_time['0'] + ':' + start_time['1'] + ' ' + stime + ' - ' + end['0'] + ':' + end['1'] + ' ' + etime + '</span><br />';
                        html += events[x].start + ' - ' + events[x].end + '<br />';
                        comments += events[x].start_date + ': ' + events[x].comments + '<br />';
                    }
                }
                day.setDate(day.getDate()+1);
                html += '</td>';
            }
            comments += '</div></div></div></div>';
            html += '</tr></table>' + comments + '</td></tr>';
        }

        html += '</tbody><tfoot></tfoot></table>';
        return html;

    }
}
