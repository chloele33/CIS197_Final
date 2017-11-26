var express = require('express');
var app = express();
var uuid = require('node-uuid');

var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var data = require('./db/user.js');
var User = data.user;

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
  extended: true
}));

app.get('/', function (req, res) {
  if (req.session.username && req.session.username !== '') {
    res.redirect('/feed');
  } else {
    res.redirect('/login');
  }
});


//login router
var loginRouter = require('./routes/login');
app.use('/', loginRouter);

//signup router
var signupRouter = require('./routes/signup');
app.use('/', signupRouter);

// enter feed, which will be a react front end eventually 
app.get('/feed', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    res.render('feed', { username: req.session.username });
  }
});

app.post('/feed', function (req, res) {
  if (req.body.act == 'updateProfile') {
    res.redirect('/editProfile');
  } else if (req.body.act == 'newPost') {
    res.redirect('/newpost');
  }
});

// edit profile router
var editProfileRouter = require('./routes/editprofile');
app.use('/', editProfileRouter);

// new post router
var newPostRouter = require('./routes/newpost');
app.use('/', newPostRouter);

app.get('/logout', function(req, res) {
  req.session.username = '';
  res.render('logout');
});

// connect server
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});


module.exports = app;
