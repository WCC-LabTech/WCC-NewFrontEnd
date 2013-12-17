var main = {
	url : 'http://bosapp-dev.wccnet.edu:8080/',
	path : window.document.URL,
	controller : '',
	func : '',
	token : localStorage['token'] || '',
	variables : [],
	userId : localStorage['userId'] || 0,
	user : '',
	loggedIn : localStorage['loggedIn'] || false,
	init : function() {
		this.time.config = this;
		this.auth.config = this;
        this.faculty.config = this;
        this.faculty.init();
        this.admin.config = this;
        this.lotto.config = this;
        this.inventory.config = this;
		if (this.loggedIn === 'true') {
			this.loggedIn = true;
			this.auth.loggedIn();
		}
		var uri = this.path;
        if (uri != '') {
            this.routes(uri);
        }
	},
    routes : function(query) {
        var uri = query.substring(query.indexOf('?')+2, query.length);
        uri = uri.split('/');
        var count = 0;
        for (i in uri) {
            if (i == 0) {
                this.controller = uri[i];
            } else if (i == 1) {
                this.func = uri[i];
            } else {
                this.variables[count] = uri[i];
                count++;
            }
        }
        window.history.pushState(this.controller, this.func, query);

        if (typeof this[this.controller] == 'object') {
            if (this.func != '') {
                this[this.controller][this.func](this.variables);
            } else {
                this[this.controller].main();
            }
        } else {
            this.error.main(404);
        }
        this.controller = '';
        this.func = '';
        this.variables = [];
    },
    ajax : function(url, method, data, async) {
        $('#loading').modal('show');
        if (async !== false) {
            async = true;
        }
        return $.ajax({
            url: url,
            method: method,
            data: data,
            dataType: 'json',
            async: async,
            beforeSend: function (request) {
                request.setRequestHeader("AUTHENTICATE", main.token);
            },
        });
    },
	home : {
        main : function() {
            $('#content').html('<div class="jumbotron"><div class="container"><h1>Washtenaw Community College</h1><p>The New and Improved BOS / CIS Web Application Portal.</p></div></div>');
        }
	},
	time : time,
	auth : auth,
    faculty : faculty,
    admin : admin,
    lotto : lotto,
    inventory : inv,
    error : {
        main : function(code) {
            console.log(code + ': There was an error. Controller: ' + main.controller + ', Function: ' + main.func);
        }
    }
}
main.init();

$('body').on('click', 'a', function(e) {
	if ($(this).attr('data-toggle') == 'modal' || $(this).attr('data-toggle') == 'dropdown' || $(this).attr('class') == 'accordion-toggle') {

	} else if ($(this).attr('href') == '?/wiki') {
		document.location = 'http://bosapp.wccnet.edu/wiki';
	} else {
    	e.preventDefault();
        if ($('.navbar-toggle').is(":visible")) {
            $('.navbar-toggle').click();
        }
    	main.routes($(this).attr('href'));
    }

});

$('body').on('submit', 'form', function(e) {
    e.preventDefault();
    main.routes($(this).attr('action'));
});

$('body').on('click', 'button', function() {
    if ($(this).attr('name')) {
        main.routes($(this).attr('name'));
    }
});

/*
watch(main, "token", function(){
    $('#test').html(main.token);
});
*/
