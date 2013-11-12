var lotto = {
    partials : 'partials/lotto/',
    content : $('#lContent'),
    main : function() {
        
        $.get(lotto.partials + 'main.html', function(data) {
            $('#content').html(data);            
        });
    },
    courses : function() {
        $.get(lotto.partials + 'courses.html', function(data) {
            $('#lContent').html(data);
        });
    },
    profiles : function() {
        $.get(lotto.partials + 'profiles.html', function(data) {
            $('#lContent').html(data);
            var html = '<ul id="faculty" class="nav nav-pills nav-stacked">';
            var users = lotto.config.ajax(lotto.config.url + 'lotto/getUserList/', 'get');
            users.success(function(data) {
                for (i in data) {
                    for (j in data[i].groups) {
                        if (data[i].groups[j] == 'Lab Aide') {
                            html += '<li><a href="?/lotto/showProfile/'+data[i].pk+'">' + data[i].first_name + ' ' + data[i].last_name + '</a></li>';
                        }
                    }
                }
                $('#loading').modal('hide');
                $('.modal-backdrop').remove();
                html += '</ul>';
                setTimeout(function() {$('.users').html(html)}, 100);
            });
        });
    },
    addCourse : function() {
        var form = $('#addCourse').serializeArray();
        var data = {};
        for (i in form) {
            data[form[i].name] = form[i].value;
        }
        data = $.param(data);
        var submit = lotto.config.ajax(lotto.config.url + 'lotto/setCourse/', 'post', data);
        $('#loading').modal('hide');
        $('.modal-backdrop').remove();
    },
    showProfile : function(data) {
        var post = {'instructor' : data[0]};
        post = $.param(post);
        var profile = lotto.config.ajax(lotto.config.url + 'lotto/getUserSkill/', 'post', post);
        profile.success(function(data) {
            console.log(data);
        });
    }
}
