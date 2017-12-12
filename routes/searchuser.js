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
		 		res.send(docs);
			});
		}  
 	});
});

module.exports = router;
