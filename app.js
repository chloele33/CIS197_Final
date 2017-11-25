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

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() { 
  console.log('listening');
});


module.exports = app;
