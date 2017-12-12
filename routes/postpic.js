var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;


router.get('/postpic/:postID', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/login');
  } else {
    Post.findById(req.params.postID, function (err, post) {
      Post.getLikers(req.params.postID, function (likerArray) {
        User.findOne({username: req.session.username}, function (err, user) {
            //already liked
            var rate = Number(post.rating);
            if (likerArray.indexOf(user._id) > -1) {
              res.render('otherspost', {username: req.session.username, 
                                    postPicSrc: "/post/"+req.params.postID,
                                    likenum: post.likes.length, 
                                    postID: req.params.postID, 
                                    heartBtnClass: 'heartbutton like',
                                  rate: rate});
            } else { // didnot like 
              res.render('otherspost', {username: req.session.username, 
                                    postPicSrc: "/post/"+req.params.postID,
                                    likenum: post.likes.length, 
                                    postID: req.params.postID, 
                                    heartBtnClass: 'heartbutton',
                                  rate: rate});
            }
        });
      });
    });
  }
});


router.get('/mypostpic/:postID', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/login');
  } else {
    Post.findById(req.params.postID, function (err, post) {
      Post.getLikers(req.params.postID, function (likerArray) {
        User.findOne({username: req.session.username}, function (err, user) {
            var rate = Number(post.rating);
            if (likerArray.indexOf(user._id) > -1) {
              res.render('mypost', {username: req.session.username, 
                                    postPicSrc: "/post/"+req.params.postID,
                                    likenum: post.likes.length, 
                                    postID: req.params.postID, 
                                    heartBtnClass: 'heartbutton like', 
                                    rate: rate});
            } else { // didnot like 
              res.render('mypost', {username: req.session.username, 
                                    postPicSrc: "/post/"+req.params.postID,
                                    likenum: post.likes.length, 
                                    postID: req.params.postID, 
                                    heartBtnClass: 'heartbutton',
                                    rate: rate,});
            }
        });
      });
    });
  }
});

router.post('/postpic/like', function (req, res) {
  Post.findById(req.body.postID, function (err, post) {
    User.findOne({username: req.session.username}, function (err, me) {
      var myID = me._id;
      Post.getLikers(req.body.postID, function (likerArray) {
      // look at othersprofile/follow for explanation
      if (likerArray.indexOf(myID) > -1) {
        Post.unlike(myID, req.body.postID, function (err) {
          if (err) {
            res.send('error' + err);
          } else {
            //res.send('new user registered with username ' + req.body.username);
            res.send("ok");
          }
        });
      } else {
      // look at othersprofile/follow for explanation
          Post.like(myID, req.body.postID, function (err) {
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
  //res.send("ok");
});


module.exports = router;
