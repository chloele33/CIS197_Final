$(document ).ready(function() {
	// makeSearchAjax();
	// $('#searchBox').on('keyup', function() {
	// 	makeSearchAjax();
	// 	//console.log($('#searchBox').val());
	// });

	// function makeSearchAjax() {
	//     $.ajax({
	//       type: 'POST',
	//       url: '/searchuser',
	//       data: { 
	//         searchuser: $('#searchBox').val() 
	//       },
	//       success: function(data) {
	//         $('#results').empty();
	//         console.log("data");
	//         //addResultsToPage(username);          
 //      	  }
 //   		});
 //  	}

 	//makeSearchAjax();
 	var searchRequest = null;
	$('#searchBox').on('keyup', function() {
		var that = this;
		var value = $(this).val();
		if (searchRequest != null) {
			searchRequest.abort();
		}
		searchRequest = $.ajax ({
		      type: 'POST',
		      url: '/searchuser',
		      dataType: "json",
		      data: { 
		        'searchuser': value 
		      },
		      success: function(userArray) {
		      	$('#results').empty();
		        if (value == $(that).val()) {
		        	addResultsToPage(userArray);   
		        }
	      	  }, 
	      	  error: function() {
	      	  	$('#results').empty();
	      	  	var entry = 
			        [ '<div id="result-box">',
			          '<h1 id = "no-result">' + "No Results Found" + '</h1>',
			          '</div>'
			        ]
	        	var individualEntry = entry.join('');
	        	if (value != '') {
	      	  		$('#results').append($(individualEntry).hide().fadeIn(1000));
	      	  	}
	      	  }
	   	});
	});

	function addResultsToPage(data) {
	    for(var i = 0; i < data.length; i++) {
	      var entry = 
	        [ '<a href= /userprofile/'+data[i]._id+'><div id="result-box" >',
	          '<img id="searchProfilePic" src= /profilePic/'+data[i]._id+' >',
	          '<p id = "searchUserInfo"><h2 id = "searchUsername">' + data[i].username + '</h2>', 
	          '<p id = "searchFullname">' + data[i].fullname + '</p></p>',
	          '</div></a>'
	        ]
	        individualEntry = entry.join('');
	        $('#results').append($(individualEntry).hide().fadeIn(500));
	    }
 	};
});