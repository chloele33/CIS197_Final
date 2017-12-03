var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;



// Implement the routes for my profile page
// get requests for profile picture
router.get('/profilePic', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    User.findOne({username: req.session.username}, function(err, user) {
        if (err) return next(err);
        res.contentType(user.profilePic.contentType);
        res.send(user.profilePic.data);
    }); 
  }
});

router.get('/myprofile', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    User.getBio(req.session.username, function(bio) {
      User.getFullname(req.session.username, function(fullname) {
        res.render('myprofile', {profilePicSrc: '/profilePic', bio: bio, username: req.session.username, fullname: fullname});
      });
    });
  }
});


router.post('/myprofile', function (req, res) {
   if (req.body.act == 'updateProfile') {
    res.redirect('/editProfile');
  } else if (req.body.act == 'newPost') {
    res.redirect('/newpost');
  }
});

module.exports = router;
