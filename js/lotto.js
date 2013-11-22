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
        lotto.user = data[0];
        $('.profile').html('');
        $.get(lotto.partials + 'profileForm.html', function(data) {
            $('.profile').html(data);
            $('form').append($('<input/>', {
                    type: 'hidden',
                    name: 'user',
                    value: lotto.user
            }));
        });
        var post = {'user' : data[0]};
        post = $.param(post);
        var profile = lotto.config.ajax(lotto.config.url + 'lotto/getUserSkill/', 'post', post);
        profile.success(function(data) {
            var skills = $('.skillList');
            var ul = $('<ul></ul>');
            //console.log(data);

            $.each(data, function() {
                console.log(this);
                ul.append($('<li></li>').html(this.course.name));
            });
            skills.append(ul);
        });
        var courses = lotto.config.ajax(lotto.config.url + 'lotto/getCourseList/', 'get');
        courses.success(function(course) {
            var dropdown = $('<select></select>').attr('name', 'skill');
            var list = course.courses;
            $.each(list, function() {
                dropdown.append($('<option/>', {
                    value: this.pk,
                    text: this.name
                    }));
            });
            $('.form-group').append(dropdown);
            $('#loading').modal('hide');
            $('.modal-backdrop').remove();   
        });
    },
    setSkill : function() {
       var form = $('#setSkill').serializeArray();
       var data = {};
       for (i in form) {
           data[form[i].name] = form[i].value;
       }
       data = $.param(data);
       var submit = lotto.config.ajax(lotto.config.url + 'lotto/setUserSkill/', 'post', data);
    },
    showCourses : function() {
        $.get(lotto.partials + 'profiles.html', function(data) {
            $('#lContent').html(data);
            var html = '<ul id="faculty" class="nav nav-pills nav-stacked">';
            var users = lotto.config.ajax(lotto.config.url + 'lotto/getCourseList/', 'get');
            users.success(function(data) {
                for (i in data.courses) {
                    console.log(data.courses[i]);
                    html += '<li><a href="?/lotto/showEligible/'+data.courses[i].pk+'">' + data.courses[i].name + ' ' + data.courses[i].crn + '</a></li>';
                }
                $('#loading').modal('hide');
                $('.modal-backdrop').remove();
                html += '</ul>';
                setTimeout(function() {$('.users').html(html)}, 100);
            });
        });
    },
    showEligible : function(course) {
        var data = {skill : course[0]};
        var users = lotto.config.ajax(lotto.config.url + 'lotto/getSkill/', 'post', data);
        $('.profile').html('');
        users.success(function(list) {
            var form = $('<form role="form" id="setCourse" class="form" method="post" action="?/lotto/setCourse"></form>');
            var ul = $('<ul class="list-group"></ul>')
            for (i in list.users) {
                ul.append('<li class="list-group-item"><label for="user'+list.users[i].pk+'""><input type="radio" name="user" id="user'+list.users[i].pk+'" value="'+list.users[i].pk+'" /> ' + list.users[i].first_name + '</label></li>');
            }
            ul.append('<li class="list-group-item"><input type="submit" name="submit" class="btn btn-primary" value="Assign To Course" />')
            form.append('<input type="hidden" name="course" value="'+course+'" />');
            form.append(ul);
            $('.profile').html(form);

            $('#loading').modal('hide');
            $('.modal-backdrop').remove();
        });
    },
    setCourse : function() {
        var form = $('#setCourse').serializeArray();
        var data = {};
        for (i in form) {
            data[form[i].name] = form[i].value;
        }
        data = $.param(data);
        var send = lotto.config.ajax(lotto.config.url + 'lotto/setUser/', 'post', data);
        send.success(function() {
            $('#loading').modal('hide');
            $('.modal-backdrop').remove();
            lotto.showCourses();
        });
    }
}
