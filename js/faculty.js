var faculty = {
    views : 'partials/faculty/',
    labtechs : {},
    
    init : function() {
        $.get(faculty.config.url + 'user/', function(response) {
            $.each(response, function() {
                if($.inArray(2, this.groups) != -1) {
                    faculty.labtechs[this.id] = this.first_name + ' ' + this.last_name;
                }
            })
        })
    },
    populate_table : function() {
        var sort = 0;
        $.ajax({
            url: faculty.config.url + 'request/admin/',
            method: 'GET',
            dataType: 'JSON',
            beforeSend: function (request) {
                request.setRequestHeader("AUTHENTICATE", faculty.config.token);
            },

            success: function(response) {
                $('#requestList').remove();
                $('#requestTable').append('<table class="table table-striped table-bordered tablesorter" cellspacing="0" cellpadding="0" id="requestList"><thead><tr><th>Due Date</th><th>Lab Tech</th><th>Request Type</th><th>Subject</th><th>Status</th><th>Accept</th></tr></thead><tbody></tbody></table>');
                for (i in response) {
                    if (response[i].fields.request_status != 'Completed') {
                        sort = 1;
                        if (response[i].fields.request_status == 'Pending') {
                            response[i].fields.modify = '<a href="?/faculty/acceptRequest/' + response[i].pk +'" id="acceptRequest" class="btn btn-default">Accept</a>';
                        } else {
                            response[i].fields.modify = '<a href="?/faculty/completeRequest/' + response[i].pk +'" id="completeRequest" class="btn btn-default">Complete</a>';
                        }
                        $('#requestList > tbody').append('<tr href="#description" onclick="$(\'#requestDesc\').html(\'' + response[i].fields.description + '\');" data-toggle="modal"><td>'+response[i].fields.due_date+'</td><td>'+faculty.labtechs[response[i].fields.labtech_Name]+'</td><td>'+response[i].fields.request_Type+'</td><td>'+response[i].fields.subject+'</td><td>'+response[i].fields.request_status+'</td><td>'+response[i].fields.modify+'</td></tr>');
                    }

                }
                if (sort == 1) {
                    $('#requestList').tablesorter({sortList: [[4,1], [0,0]]});
                };
                faculty.config.auth.populate_user_table();
            },

            error: function(response) {

            }
        });
 
    },
    requests : function() {
        $.get(faculty.views + 'requests.html', function(response) {
            $('#content').html(response);
            faculty.populate_table();
        });
    },
    addRequest : function() {
        var form = $('#requestForm').serializeArray();
        var data = {};
        for (i in form) {
            data[form[i].name] = form[i].value;
        }

        data.upload = "";
        $('#facultyRequests').modal('hide');
        $.ajax({
            url: faculty.config.url + 'request/derp/',
            method: 'POST',
            data : data,
            dataType : 'json',
            beforeSend : function(request) {
                request.setRequestHeader('AUTHENTICATE', faculty.config.token);
            },
            success : function(response) {
                faculty.populate_table();
            },
            error : function(response) {
                main.error.main(response.status);
            }
        });
    },
    acceptRequest : function(id) {
        var data = {};
        data.id = id[0];
        data.labtech_Name = faculty.config.userId;
        data.request_status = "Approved";

        $.ajax({
            url: faculty.config.url + 'request/update/',
            method: 'POST',
            data: data,
            beforeSend: function(request) {
                request.setRequestHeader("AUTHENTICATE", faculty.config.token);
            },
            success: function(resposne) {
                faculty.populate_table();
            },
            error: function(response) {
                main.error.main(response.status);
            }
        });
    },
    completeRequest : function(id) {
        var data = {};
        data.id = id[0];
        data.labtech_Name = faculty.config.userId;
        data.request_status = "Completed";

        $.ajax({
            url: faculty.config.url + 'request/update/',
            method: 'POST',
            data: data,
            beforeSend: function(request) {
                request.setRequestHeader("AUTHENTICATE", faculty.config.token);
            },
            success: function(response) {
                faculty.populate_table();
            },
            error: function(response) {
                main.error.main(response.status);
            }
        });
    }
}
