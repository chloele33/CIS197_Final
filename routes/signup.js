var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;



// Implement the routes for login page
router.get('/signup', function (req, res) {
  res.render('signup');
});

router.post('/signup', function (req, res) {
  if (req.body.password != req.body.confirmpassword) {
    res.send('Make sure your passwords match!');
  }
  else {
    User.addUser(req.body.username, req.body.password, req.body.fullname, req.body.email, function(err) {
    if (err) {
      res.send('error' + err);
    } else {
      //res.send('new user registered with username ' + req.body.username);
      res.redirect('login');
    }
    });
  }
});

module.exports = router;
