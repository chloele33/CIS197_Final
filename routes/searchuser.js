var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;



// Implement the routes for my profile page
// get requests for profile picture
router.get('/searchuser', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login');
  } else {
    res.render('searchuser');
  }
});

var exactUser = null;
var userArray = [];
router.post('/searchuser', function (req, res) {
	//console.log(req.body.searchuser);
	// called by searchuser.js
	// goal is to return the user with the exact username as the first element,
	// and return anyother user with a username starting with the search and 
	// var searchTerm = req.body.searchuser;
	// User.findOne({username: searchTerm.toLowerCase()}, function(err, user) {
	// 	if (user != null) {
	// 		exactUser = user;
	// 		userArray.push(user);
	// 		//console.log("found exact user.")
	// 	}      
 // 	});
 // 	User.find({'fullname': searchTerm}, function(err, user) {
 // 		//console.log(user.length);
 // 		for (var i = 0; i < user.length; i++) {
 // 			if (exactUser != null) { // if we found a user with the exact user name above
 // 				if (user[i].username != exactUser.username) {
 // 					userArray.push(user[i]);
 // 				}
 // 			} else {
 // 				userArray.push(user[i]);
 // 			}
 // 		}
 // 	});
 // 	if (userArray.length > 0) {
 // 		res.send(userArray);
 // 		userArray = [];
 // 	}
 	var searchTerm = req.body.searchuser;
	User.findOne({username: searchTerm.toLowerCase()}, function(err, user) {
		if (user != null) {
			User.find({'fullname': searchTerm}, function(err, docs) {
				var array = [user];
				for (var i = 0; i < docs.length; i++) {
					if (docs[i].username != user.username) {
						array.push(docs[i]);
					}
				}
				res.send(array);
			}); 
		} else {
			User.find({'fullname': searchTerm}, function(err, docs) {
		 		if (docs.length > 0) {
		 			res.send(docs);
		 		}
			});
		}  
 	});
});

module.exports = router;
