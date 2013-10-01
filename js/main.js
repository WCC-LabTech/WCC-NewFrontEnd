var main = {
	url : 'http://bosapp.wccnet.edu:8080/',
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
	home : {
		init : function() {

		}

	},
	time : time,
	auth : auth,
    faculty : faculty,
    admin : admin,
    error : {
        main : function(code) {
            console.log(code + ': There was an error. Controller: ' + this.controller + ', Function: ' + this.func);
        }
    }
}
main.init();

$('body').on('click', 'a', function(e) {
	if ($(this).attr('data-toggle') == 'modal') {

	} else if ($(this).attr('data-toggle') == 'dropdown') { 
    
    } else if ($(this).attr('href') == '?/wiki') {
		document.location = 'http://bosapp.wccnet.edu/wiki';
	} else {
    	e.preventDefault();
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

