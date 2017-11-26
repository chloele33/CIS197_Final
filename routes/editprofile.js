var express = require('express');
var router = express.Router();
var User = require('../db/user');



// Implement the routes for edit profile page
router.get('/editprofile', function (req, res) {
  //res.render('editProfile');
  User.getFullname(req.session.username, function(fullname) {
    User.getBio(req.session.username, function(bio) {
       res.render('editProfile', {fullname: fullname, bio: bio});
    });
  });
});

router.post('/editprofile', function (req, res) {
  User.updateBio(req.session.username, req.body.bio);
  User.updateFullname(req.session.username, req.body.fullname);
  res.send('Profile Updated.');
});

module.exports = router;
