var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;



// Implement the routes for my profile page
// get requests for profile picture
router.get('/profilePic', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login');
  } else {
    User.findOne({username: req.session.username}, function(err, user) {
        if (err) return next(err);
        res.contentType(user.profilePic.contentType);
        res.send(user.profilePic.data);
    }); 
  }
});

// get requests for profile picture
router.get('/profilePic/:userID', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login');
  } else {
    User.findById(req.params.userID, function(err, user) {
        if (err) return next(err);
        res.contentType(user.profilePic.contentType);
        res.send(user.profilePic.data);
    }); 
  }
});

//routher to get posts 
router.get('/post/:postID', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login');
  } else {
    Post.findById(req.params.postID, function(err, post) {
        if (err) return next(err);
        res.contentType(post.img.contentType);
        res.send(post.img.data);
    }); 
  }
});

router.get('/myprofile', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login');
  } else {
    User.getBio(req.session.username, function (bio) {
      User.getFullname(req.session.username, function (fullname) {
        User.getPosts(req.session.username, function (postIDArray) {
          User.getFollowing(req.session.username, function (followingArray) {
            User.getFollowers(req.session.username, function (followerArray) {
                // postValue stores the ID of the post and inserts as value into html
                // so we can track the post in the database 
                var postValue = [];
                // turn array into the format of /post/postID
                for (var i = 0; i < postIDArray.length; i++) {
                  postValue = postIDArray[i];
                  postIDArray[i] = '/post/' + postIDArray[i];
                }
                res.render('myprofile', {postID: postValue,
                                          posts: postIDArray, 
                                          profilePicSrc: '/profilePic', 
                                          bio: bio, 
                                          username: req.session.username, 
                                          fullname: fullname,
                                          following: followingArray.length,
                                          followers: followerArray.length});
            });
          });
        });
      });
    });
  }
});


router.post('/myprofile', function (req, res) {
   if (req.body.act == 'updateProfile') {
    res.redirect('/editProfile');
  } else if (req.body.act == 'newPost') {
    res.redirect('/newpost');
  }
});

module.exports = router;
