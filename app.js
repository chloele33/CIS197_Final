var express = require('express');
var app = express();
var uuid = require('node-uuid');

var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var User = require('./db/user');

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));


// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};

// cookie session middleware
app.use(cookieSession({
  name: 'session',
  secret: generateCookieSecret()
}));

// body Parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function (req, res) {
  if (req.session.username && req.session.username !== '') {
    res.redirect('/feed');
  } else {
    res.redirect('/login');
  }
});


// login page
app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  username = req.body.username;
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

// signup page 
app.get('/signup', function (req, res) {
  res.render('signup');
});

app.post('/signup', function(req, res) {
  User.addUser(req.body.username, req.body.password, req.body.fullname, req.body.email, function(err) {
    if (err) {
    	res.send('error' + err);
    } else {
    	res.send('new user registered with username ' + req.body.username);
    }
  });
});

// enter feed
app.get('/feed', function(req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    res.render('protected', { username: req.session.username });
  }
});


// connect server
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});


module.exports = app;
