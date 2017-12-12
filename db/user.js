var mongoose = require('mongoose');
var fs = require('fs');
mongoose.connect('mongodb://localhost/foodiegram');

var Schema = mongoose.Schema;
// bcrypt for securing password information
var bcrypt = require('bcrypt');

// define schemas
var userSchema = new Schema({
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  email: {type: String, lowercase: true, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'Invalid Email. Valid email example: hello@foodiegram.com']},
  bio: { type: String, default: ''},
  posts: [{type: Schema.ObjectId, ref: 'Post'}],
  following: [{ type: Schema.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.ObjectId, ref: 'User' }],
  favorites: [{type: Schema.ObjectId, ref: 'Post'}], 
  profilePic: {data: Buffer, contentType: String}
});

var postSchema = new Schema({
  img: {data: Buffer, contentType: String},
  _creater: { type: Schema.ObjectId, ref: 'User' }, 
  likes: [{ type: Schema.ObjectId, ref: 'User' }], 
  rating: {type: Number, max: 5, min: 0},
  caption: { type: String },
  created_at: Date, 
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
  username: {type: String, lowercase: true},
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
  User.findOne({username: username}, function (err, docs) {
    if (docs) {
      cb(' Username Exists');
    } else {
      User.findOne({email: email}, function (error, user) {
        if (user) {
          cb(' Email Exists');
        } else {
          // successfully add
            var newUser = new User({ username: username, password: password, fullname: name, email: email});
            newUser.profilePic.data = fs.readFileSync('defaultPic.png');
            newUser.profilePic.contentType = 'image/png';
            newUser.save(cb);
        }
      });
    }
  });
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

userSchema.statics.updateProfilePic = function (username, profilePic, cb) {
  User.findOne({username: username}, function(err, user) {
      user.profilePic.data = profilePic.data;
      user.profilePic.contentType = profilePic.mimetype;
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

userSchema.statics.getPosts = function (username, cb) {
  User.findOne({username: username}, function(err, user) {
    return cb(user.posts);
  });
}

userSchema.statics.getFollowers = function (username, cb) {
  User.findOne({username: username}, function(err, user) {
    return cb(user.followers);
  });
}

userSchema.statics.getFollowing= function (username, cb) {
  User.findOne({username: username}, function (err, user) {
    return cb(user.following);
  });
}

userSchema.statics.getUsernameArray= function (userIdArray, cb) {
  var returnArray = [];
  for (var i = 0; i < userIdArray; i++) {
    User.findById(userIdArray[i], function (err, user) {
      returnArray[i] = user.username;
      return cb(returnArray);
    });
  }
}

userSchema.statics.unfollow = function (myUserID, userID, cb) {
  // User.update({_id: myUserID}, { "$pull": { "following": { "User": userID } }}, false, true);
  // User.update({_id: userID}, { "$pull": { "followers": { "User": myUserID } }}, false, true);
  User.findById(myUserID, function (err, me) {
    User.findById(userID, function (eror, user) {
      me.following.pull(user);
      user.followers.pull(me);
      user.save();
      me.save();
      cb(null);
    });
  });
}

userSchema.statics.follow = function (myUserID, userID, cb) {
  User.findById(myUserID, function (err, me) {
    User.findById(userID, function (eror, user) {
      me.following.push(user);
      user.followers.push(me);
      user.save();
      me.save();
      cb(null);
    });
  });
}

userSchema.statics.getFavorites = function (username, cb) {
  User.findOne({username: username}, function (err, user) {
    return cb(user.favorites);
  });
}

userSchema.statics.favorite = function (myUserId, postID, cb) {
  User.findById(myUserId, function (err, me) {
    Post.findById(postID, function (eror, post) {
      me.favorites.push(post);
      me.save();
      cb(null);
    });
  });
}

userSchema.statics.unfavorite = function (myUserId, postID, cb) {
  User.findById(myUserId, function (err, me) {
    Post.findById(postID, function (eror, post) {
      me.favorites.pull(post);
      me.save();
      cb(null);
    });
  });
}

// postSchema statics/methods
postSchema.statics.addPost = function (username, imagefile, rating, caption, cb) {
  User.findOne({username: username}, function (err, user) {
    var newPost = new Post({caption: caption, rating: rating, _creater: user._id});
    newPost.created_at = new Date();
    newPost.img.data = imagefile.data;
    newPost.img.contentType = imagefile.mimetype;
    newPost.save();
    user.posts.push(newPost);
    user.save();
    cb(null);
  });
}

postSchema.statics.getLikers = function (postID, cb) {
  Post.findById(postID, function (err, post) {
    return cb(post.likes);
  });
}

postSchema.statics.like = function (userId, postID, cb) {
  User.findById(userId, function (err, me) {
    Post.findById(postID, function (eror, post) {
      post.likes.push(me);
      post.save();
      cb(null);
    });
  });
}

postSchema.statics.unlike = function (userId, postID, cb) {
  User.findById(userId, function (err, me) {
    Post.findById(postID, function (eror, post) {
      post.likes.pull(me);
      post.save();
      cb(null);
    });
  });
}

postSchema.statics.getComments = function (postID, cb) {
  Post.findById(postID, function (err, post) {
    return cb(post.comments);
  });
}

//comment functions
commentSchema.statics.addComment = function (username, postID, commentContent, cb) {
  Post.findById(postID, function (err, post) {
    User.findOne({username: username}, function (err, user) {
      var newComment = new Comment({author: user._id, content: commentContent, username: username});
      newComment.created_at = new Date();
      newComment.save();
      post.comments.push(newComment);
      post.save();
      cb(null);
    });
  });
}


// save models
var User = mongoose.model('User', userSchema);
var Place = mongoose.model('Place', placeSchema);
var Post = mongoose.model('Post', postSchema);
var Comment = mongoose.model('Comment', commentSchema);


module.exports = {user: User, post: Post, comment: Comment};
