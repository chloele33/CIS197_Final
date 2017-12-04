var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;



// Implement the routes for my profile page
// get requests for profile picture
router.get('/searchuser', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    res.render('searchuser');
  }
});


module.exports = router;
