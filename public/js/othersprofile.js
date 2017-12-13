$(document).ready(function() {

	$('body').on('click', '#followBtn', function() {
		var self = $(this);
    	$.ajax({
      	type: 'POST',
     		url: '/othersprofile/follow',
      	data: { 
      		username: $('#username').text()
      	},
      	dataType: 'text',
      	success: function (data) {
      		if (self.text() === 'Follow') {
    				var newCount = Number($('#followers').text()) + 1;
    				$('#followers').text(newCount);
    			} else {
					var newCount = Number($('#followers').text()) - 1;
    				$('#followers').text(newCount);
    			}
     			var newText = self.text() === 'Follow' ? 'Unfollow' : 'Follow'
      		self.text(newText);
     	 	},
     	 	error: function (data) {
       			//console.log("ERRR");
     	 	}
    	});
	});
});