var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;


// Implement the routes for edit profile page
router.get('/newpost', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login');
  } else {
    res.render('newpost');
  }
});

router.post('/newpost', function (req, res) {
  if (!req.files) {
  	return res.status(400).send('No files were uploaded.');
  } else {
  	// retrieve all info from the form in newpost.html
  	var imagefile = req.files.imagefile;

    var rating = req.body.rate;
    if (!rating) {
  	  rating = 0;
    }
    var caption = req.body.caption;

    // call addPost method
    Post.addPost(req.session.username, imagefile, rating, caption, function(err) {
	  if (err) {
        res.send('error' + err);
      } else {
        res.redirect('myprofile');
      }
    });
  }
});

module.exports = router;
