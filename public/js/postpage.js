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
    		dataType: 'text',
    		success: function(data) {
    			var newText = self.text() === 'Save To Favorites' ? 'Remove From Fravorites' : 'Save To Favorites'
      		self.text(newText);
     	 	},
     	 	error: function(data) {
       			//console.log("ERRR");
     	 	}
    	});
	});

	

	$('body').on('click', '#submitComment', function() {
		console.log("CLICKED");
		// var self = $(this);
		var commentContent = $("#commentInput");  
		if (commentContent.val() !== '') {
			$.ajax({
      	type: 'POST',
     		url: '/postpic/comment',
    		data: { 
    			postID: $('#postpage').attr('class'), 
    			commentContent:  commentContent.val()
    		},
    		dataType: 'json',
    		success: function(user) {
    			//console.log("hi");
    			// var newText = self.text() === 'Save To Favorites' ? 'Remove From Fravorites' : 'Save To Favorites'
      	// 	self.text(newText);
      		var newComment = commentContent.val();
      		addCommentToPage(newComment, user);
     	 	},
     	 	error: function(data) {
       			//console.log("ERRR");
     	 	}
    	});
		}
	});

	function addCommentToPage(comment, user) {
		var date = new Date();
		var dateString = date.toDateString() + ' ' + date.getHours() +':' + date.getMinutes();
    var entry = 
    [ '<div id="comment-cell" >',
      '<img id="commentProfilePic" src= /profilePic/'+user._id+' >',
      '<p id = "commentInfo"><h2 id = "commentCreater">' + user.username + '</h2>', 
      '<p id = "commentdate">' + dateString + '</p>',
      '<p id = "commentText">' + comment + '</p></p>',
      '</div>'
    ]
    individualEntry = entry.join('');
    $('#commentContent').append($(individualEntry).hide().fadeIn(500));
    $('#commentInput').val('');
 	};

});