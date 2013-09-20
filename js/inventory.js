function inv(url) {
    
    var inventory = {};
    $.getJSON(url + 'inventory/all/All/', function(response) {
        inventory = response;
    });
    
    this.main = function() {
       console.log(inventory); 
    }

}

