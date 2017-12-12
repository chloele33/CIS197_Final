var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;

router.get('/feed', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('login');
  } else {
    User.findOne({username: req.session.username}, function (err, user) {
      User.getFollowing(req.session.username, function (followingArray) {
        Post.find({}, function (err, allPosts) {
          followingArray.push(user._id);
          for (var i = 0; i < allPosts.length; i++) {
            // if the posts' creater is not someone the user follows, remove it from array
            if (followingArray.indexOf(allPosts[i]._creater) < 0) {
              allPosts.splice(i, 1);
              i--;
            }
          }
          console.log(followingArray);
          console.log(allPosts);
          var postPicArray = [];
          var postValue = [];
          for (var j = 0; j < allPosts.length; j++) {
            postValue[j] = allPosts[j]._id;
            postPicArray[j] = '/postPic/' + allPosts[j]._id;
            allPosts[j] = '/post/' + allPosts[j]._id;
          }
          res.render('feed', {postID: postValue,
            posts: allPosts, 
            postPic: postPicArray,
            username: req.session.username});
        });
      });
    });
  }
});


module.exports = router;


// postValue stores the ID of the post and inserts as value into html
            // so we can track the post in the database 
          //   var postValue = [];
          //   var postPicArray = [];
          //   // turn array into the format of /post/postID
          //   for (var i = 0; i < postIDArray.length; i++) {
          //     postValue = postIDArray[i];
          //     postPicArray[i] = '/mypostPic/' + postIDArray[i];
          //     postIDArray[i] = '/post/' + postIDArray[i];
          //   }
          //   res.render('myprofile', {postID: postValue,
          //     posts: postIDArray, 
          //     postPic: postPicArray,
          //     profilePicSrc: '/profilePic', 
          //     bio: bio, 
          //     username: req.session.username, 
          //     fullname: fullname,
          //     following: followingArray.length,
          //     followers: followerArray.length});
          // });