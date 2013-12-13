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
            var ul = $('<ul class="list-group"></ul>');

            $.each(data, function() {
                ul.append($('<li class="list-group-item"></li>').html(this.course.name + '<span class="pull-right glyphicon glyphicon-remove-circle"></span>'));
            });
            skills.append(ul);
        });
        var courses = lotto.config.ajax(lotto.config.url + 'lotto/getSkillList/', 'get');
        courses.success(function(course) {
            console.log(course);
            var dropdown = $('<select></select>').attr('name', 'skill');
            var list = course.skills;
            console.log(list);
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
       var user = [];
       user[0] = lotto.user;
       lotto.showProfile(user);
    },
    showCourses : function() {
        $.get(lotto.partials + 'profiles.html', function(data) {
            $('#lContent').html(data);
            var html = '<ul id="faculty" class="nav nav-pills nav-stacked">';
            var users = lotto.config.ajax(lotto.config.url + 'lotto/getCourseList/', 'get');
            users.success(function(data) {
                for (i in data.courses) {
                    html += '<li><a href="?/lotto/showEligible/'+data.courses[i].pk+'">' + data.courses[i].name + ' ' + data.courses[i].crn + '</a><ul class="nav nav-pills">';
                    html += '<li><a class="btn btn-danger btn-xs glyphicon glyphicon-remove-circle" style="padding:1px 5px;" href="?/lotto/deleteCourse/'+data.courses[i].pk+'"></a></li></ul></li>'
                }
                $('#loading').modal('hide');
                $('.modal-backdrop').remove();
                html += '</ul>';
                setTimeout(function() {$('.users').html(html)}, 100);
            });
        });
    },
    showEligible : function(course) {
        lotto.course = course[0];
        var data = {skill : course[0]};
        var users = lotto.config.ajax(lotto.config.url + 'lotto/getSkill/', 'post', data);
        $('.profile').html('');
        users.success(function(list) {
            var form = $('<form role="form" id="setCourse" class="form" method="post" action="?/lotto/setCourse"></form>');
            var ul = $('<ul class="list-group"></ul>')
            for (i in list.users) {
                ul.append('<li class="list-group-item"><label for="user'+list.users[i].pk+'""><input type="radio" name="user" id="user'+list.users[i].pk+'" value="'+list.users[i].pk+'" /> ' + list.users[i].first_name + ' ' + list.users[i].last_name + '</label></li>');
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
            var course = [];
            course[0] = lotto.course;
            lotto.showEligible(course);
        });
    },
    deleteCourse : function(course) {
        var data = {course : course[0]};
        lotto.config.ajax(lotto.config.url + 'lotto/deleteCourse/', 'post', data);
        lotto.showCourses();
    },

    deleteSkill : function(skill) {
        var data = {skill : skill[0]};
        lotto.config.ajax(lotto.config.url + 'lotto/deleteSkill/', 'post', data);
        lotto.profiles();
    }
}
