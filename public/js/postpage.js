$(document ).ready(function() {
	$('body').on('click', '#heart', function() {
		var self = $(this);
    	$.ajax({
      		type: 'POST',
     		url: '/postpic/like',
      		data: { 
      			postID: $('#postpage').attr('class')
      		},
      		dataType: "text",
      		success: function(data) {
      			if (!self.hasClass('like')) {
      				var newCount = Number($('#numlikes').text()) + 1;
      				$('#numlikes').text(newCount);
      				self.addClass('like');
      			} else {
					var newCount = Number($('#numlikes').text()) - 1;
      				$('#numlikes').text(newCount);
      				self.removeClass('like');
      			}
     	 	},
     	 	error: function(data) {
       			//console.log("ERRR");
     	 	}
    	});
	});

	$('body').on('click', '#favorite', function() {
		var self = $(this);
    	$.ajax({
      		type: 'POST',
     		url: '/postpic/favorite',
      		data: { 
      			postID: $('#postpage').attr('class')
      		},
      		dataType: "text",
      		success: function(data) {
      			console.log("hi");
      			var newText = self.text() === 'Save To Favorites' ? 'Remove From Fravorites' : 'Save To Favorites'
        		self.text(newText);
     	 	},
     	 	error: function(data) {
       			//console.log("ERRR");
     	 	}
    	});
	});
});