var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;



// Implement the routes for login page
router.get('/login', function (req, res) {
  if (!req.session.username || req.session.username === '') {
     res.render('login');
   } else {
    res.redirect('myprofile');
   }
});

router.post('/login', function (req, res) {
  username = req.body.username.toLowerCase();
  password = req.body.password;
  User.checkIfLegit(username, password, function(err, isRight) {
    if (err) {
      res.send('Error! ' + err);
    } else {
      if (isRight) {
        req.session.username = username;
        res.redirect('/feed');
      } else {
        res.send('wrong password');
      }
    }
  });
});

module.exports = router;
