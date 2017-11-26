var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/foodiegram');

var Schema = mongoose.Schema;
// bcrypt for securing password information
var bcrypt = require('bcrypt');

// define schemas
var userSchema = new Schema({
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true},
  email: {type: String, lowercase: true, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'Invalid Email. Valid email example: hello@foodiegram.com']},
  bio: { type: String, default: ''},
  posts: [{type: Schema.ObjectId, ref: 'Post'}],
  following: [{ type: Schema.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.ObjectId, ref: 'User' }],
  favorites: [{type: Schema.ObjectId, ref: 'Post'}]
});

var postSchema = new Schema({
  img: {data: Buffer, contentType: String},
  _creater: { type: Schema.ObjectId, ref: 'User' }, 
  likes: [{ type: Schema.ObjectId, ref: 'User' }], 
  rating: {type: Number, max: 5, min: 0},
  caption: { type: String },
  created_at: Date, 
  updated_at: Date,
  place: {type: Schema.ObjectId, ref: 'Place'},
  comments: [{ type: Schema.ObjectId, ref: 'Comment' }]
});

var placeSchema = new Schema({
  name: {type: String},
  latitude :{ type: Number}, 
  longtitude: { type: Number}
});

var commentSchema = new Schema({
  content: {type: String},
  author : { type: Schema.ObjectId, ref: 'User' }, 
  created_at: Date
});

// user schema functions
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
  // User.find({username: username, email: email}, function(err, docs) {
  //   if (docs.length != 0){
  //     if(docs[0].username) {
  //       cb('Username exists already',null);
  //     } else {
  //       cb('Email exists already',null);
  //     }
  //   } else {
  //     if (err) {
  //       return cb(err);
  //     }
  //     var newUser = new this({ username: username, password: password, name: name, email: email});
  //     newUser.save(cb);
  //   }
  // });
  var newUser = new this({ username: username, password: password, fullname: name, email: email});
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

userSchema.statics.updateBio = function (username, bio, cb) {
  User.findOne({username: username}, function(err, user) {
      user.bio = bio;
      user.save();
  });
}

userSchema.statics.updateFullname = function (username, name, cb) {
  User.findOne({username: username}, function(err, user) {
      user.fullname = name;
      user.save();
  });
}

userSchema.statics.getFullname = function (username, cb) {
  var name;
  User.findOne({username: username}, function(err, user) {
    name = user.fullname;
    return cb(name);
  });
}

userSchema.statics.getBio = function (username, cb) {
  var bio;
  User.findOne({username: username}, function(err, user) {
    bio = user.bio;
    return cb(bio);
  });
}

// postSchema statics/methods
postSchema.statics.addPost = function (username, imagePath, rating, caption, cb) {
  User.findOne({username: username}, function(err, user) {

  });
}

// save models
var User = mongoose.model('User', userSchema);
var Place = mongoose.model('Place', placeSchema);
var Post = mongoose.model('Post', postSchema);
var Comment = mongoose.model('Comment', commentSchema);


module.exports = {user: User, post: Post};
