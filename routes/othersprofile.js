var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;



// Implement the routes for other profile page

router.get('/userprofile/:userID', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/login');
  } else {
    //console.log(req.params.userID);
    User.findById(req.params.userID, function(err, user) {
      if (err) return next(err);
      if (user.username == req.session.username) {
        res.redirect('/myprofile');
      } else { //another user's profile
          User.getBio(user.username, function (bio) {
            User.getFullname(user.username, function (fullname) {
              User.getPosts(user.username, function (postIDArray) {
                User.getFollowing(user.username, function (followingArray) {
                  User.getFollowers(user.username, function (followerArray) {
                    User.getFollowing(req.session.username, function (myFollowingArray) {
                      // checks if the button should say "unfollow" or "follow"
                      // if currently following
                      console.log(myFollowingArray);
                      if (myFollowingArray.indexOf(req.params.userID) > -1) {
                          // postValue stores the ID of the post and inserts as value into html
                          // so we can track the post in the database 
                          var postValue = [];
                          // turn array into the format of /post/postID
                          for (var i = 0; i < postIDArray.length; i++) {
                            postValue = postIDArray[i];
                            postIDArray[i] = '/post/' + postIDArray[i];
                          }
                          res.render('othersprofile', {postID: postValue,
                                                    posts: postIDArray, 
                                                    profilePicSrc: '/profilePic/'+req.params.userID, 
                                                    bio: bio, 
                                                    username: user.username, 
                                                    followBtn: 'Unfollow',
                                                    fullname: fullname,
                                                    following: followingArray.length,
                                                    followers: followerArray.length});
                      } else { //if currently not following
                        // postValue stores the ID of the post and inserts as value into html
                        // so we can track the post in the database 
                        var postValue = [];
                        // turn array into the format of /post/postID
                        for (var i = 0; i < postIDArray.length; i++) {
                          postValue = postIDArray[i];
                          postIDArray[i] = '/post/' + postIDArray[i];
                        }
                        res.render('othersprofile', {postID: postValue,
                                                  posts: postIDArray, 
                                                  profilePicSrc: '/profilePic/'+req.params.userID, 
                                                  bio: bio, 
                                                  username: user.username,
                                                  followBtn: 'Follow', 
                                                  fullname: fullname,
                                                  following: followingArray.length,
                                                  followers: followerArray.length});
                    
                      }
                    }); 
                  });
                });
              });
            });
          });
        }
      }); 
    }
});


router.post('/othersprofile/follow', function (req, res) {
  User.findOne({username: req.body.username}, function (err, user) {
    var userID = user._id;
    User.findOne({username: req.session.username}, function (err, me) {
      var myID = me._id;
      User.getFollowing(req.session.username, function (myFollowingArray) {
      // if arrayOfId already contains the user, means already following user, 
      // so when clicked, we want to unfollow the user: user removed from following
      // and I am removed from the user's follower list
      if (myFollowingArray.indexOf(userID) > -1) {
        User.unfollow(myID, userID, function (err) {
          if (err) {
            res.send('error' + err);
          } else {
            //res.send('new user registered with username ' + req.body.username);
            res.send("ok");
          }
        });
      } else {
      // if arrayOfId does NOT contain the user, means already following user, 
      // so when clicked, we want to unfollow the user: user removed from following
      // and I am removed from the user's follower list
          User.follow(myID, userID, function (err) {
            if (err) {
              res.redirect('error' + err);
            } else {
              res.send("ok");
            }
          });
        }
      });
    });
  });
});

module.exports = router;
