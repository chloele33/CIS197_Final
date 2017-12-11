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
    console.log(req.params.userID);
    User.findById(req.params.userID, function(err, user) {
        if (err) return next(err);
        if (user.username == req.session.username) {
          res.redirect('/myprofile');
        } else { //another user's profile
            User.getBio(user.username, function (bio) {
              User.getFullname(user.username, function (fullname) {
                User.getPosts(user.username, function (postIDArray) {
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
                                            fullname: fullname});
                });
              });
          });
        }
    }); 
  }
});


// router.post('/myprofile', function (req, res) {
//    if (req.body.act == 'updateProfile') {
//     res.redirect('/editProfile');
//   } else if (req.body.act == 'newPost') {
//     res.redirect('/newpost');
//   }
// });

module.exports = router;
