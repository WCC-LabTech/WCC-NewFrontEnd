var cal = {
    url : 'http://jira.cspuredesign.com:8888/rest/api/2/',
    response : null,
    init : function() {
        $.getJSON(url + 'project', function(response) {
            cal.response = response;
        });
    }

}
