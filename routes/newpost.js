var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;
var fs = require('fs');



// Implement the routes for edit profile page
router.get('/newpost', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    res.render('newpost');
  }
  // User.getFullname(req.session.username, function(fullname) {
  //   User.getBio(req.session.username, function(bio) {
  //      res.render('editProfile', {fullname: fullname, bio: bio});
  //   });
  // });
});

router.post('/newpost', function (req, res) {
  // User.updateBio(req.session.username, req.body.bio);
  // User.updateFullname(req.session.username, req.body.fullname);
  // res.send('Profile Updated.');
  var rating = req.body.rate;
  if (!rating) {
  	rating = 0;
  }
  var caption = req.body.caption;
  //var imageData = req.files.imagefile.path;
  // console.log(imageData);
  var imagePath = req.body.imagefile;
  Post.addPost(req.session.username, imagePath, rating, caption, function(err) {
	if (err) {
      res.send('error' + err);
    } else {
      res.redirect('feed');
    }
  });
});

module.exports = router;
