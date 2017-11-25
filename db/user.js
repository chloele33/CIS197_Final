var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/foodiegram');

var Schema = mongoose.Schema;
// bcrypt for securing password information
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true},
  email: {type: String, lowercase: true, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'Invalid Email. Valid email example: hello@foodiegram.com']},
  bio: { type: String},

});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// bad practice, becasue actually should check if username exists in the database. 
// this also throws an error, but we should throw an error intentionally ourselves. 
userSchema.statics.addUser = function(username, password, name, email, cb) {
  var newUser = new this({ username: username, password: password, name: name, email: email});
  newUser.save(cb);
}

userSchema.statics.checkIfLegit = function(username, password, cb) {
  this.findOne({ username: username }, function(err, user) {
    if (!user) cb('no user');
    else {
      bcrypt.compare(password, user.password, function(err, isRight) {
        if (err) return cb(err);
        cb(null, isRight);
      });
    };
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;
