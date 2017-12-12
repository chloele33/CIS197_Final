var express = require('express');
var router = express.Router();
var data = require('../db/user.js');
var User = data.user;
var Post = data.post;
var Comment = data.comment;


router.get('/postpic/:postID', function (req, res) {
  if (!req.session.username || req.session.username === '') {
    res.redirect('/login');
  } else {
    Post.findById(req.params.postID, function (err, post) {
      Post.getLikers(req.params.postID, function (likerArray) {
        User.findOne({username: req.session.username}, function (err, user) {
          User.getFavorites(req.session.username, function (favoriteArray) {
            User.findById(post._creater, function (err, creater) {
              var rate = Number(post.rating);
              var date = new Date(post.created_at);
              date = date.toDateString() + ' ' + date.getHours() +':' + date.getMinutes()
              var caption = post.caption;
              User.findById(post._creater, function (err, creater) {
                if (creater.username == req.session.username) {
                  res.redirect('/mypostpic/'+req.params.postID);
                } else {
                  Post.getComments(req.params.postID, function (commentsIDArray) {
                    Comment.find({'_id': {$in: commentsIDArray}}, function (err, commentData) {
                      var commentUsernameArray = [];
                      var commentProfilePicArray = [];
                      var commentContentArray = [];
                      var commentUserProfileArray = [];
                      var commentDateArray = [];
                      var commentStart = commentData.length - 10;
                      if (commentStart < 0) {
                        commentStart = 0;
                      }
                      for (var i = commentStart; i < commentData.length; i++) {
                        commentUsernameArray[i - commentStart] = commentData[i].username;
                        commentContentArray[i - commentStart] = commentData[i].content;
                        commentProfilePicArray[i - commentStart] = '/profilePic/' + commentData[i - commentStart].author;
                        commentUserProfileArray[i - commentStart] = '/userprofile/' + commentData[i - commentStart].author;
                        var comDate = new Date(commentData[i - commentStart].created_at);
                        commentDateArray[i - commentStart] = comDate.toDateString() + ' ' + comDate.getHours() +':' + comDate.getMinutes();
                      }
                      //already liked
                      if (likerArray.indexOf(user._id) > -1) {
                        //already favorited 
                        if (favoriteArray.indexOf(req.params.postID) > -1) {
                          res.render('otherspost', {username: creater.username, 
                            postPicSrc: "/post/"+req.params.postID,
                            likenum: post.likes.length, 
                            postID: req.params.postID, 
                            heartBtnClass: 'heartbutton like',
                            caption: caption,
                            date: date,
                            rate: rate, 
                            favorite: 'Remove From Fravorites',
                            commentUserProfile: commentUserProfileArray,
                            commentProfilePic: commentProfilePicArray,
                            commentCreater: commentUsernameArray,
                            commentDate: commentDateArray, 
                            commentContent: commentContentArray,
                            allcommentsrequest: '/allcomments/'+req.params.postID });
                        } else {
                          res.render('otherspost', {username: creater.username, 
                            postPicSrc: "/post/"+req.params.postID,
                            likenum: post.likes.length, 
                            postID: req.params.postID, 
                            heartBtnClass: 'heartbutton like',
                            caption: caption,
                            date: date,
                            rate: rate, 
                            favorite: 'Save To Favorites', 
                            commentUserProfile: commentUserProfileArray,
                            commentProfilePic: commentProfilePicArray,
                            commentCreater: commentUsernameArray,
                            commentDate: commentDateArray, 
                            commentContent: commentContentArray,
                            allcommentsrequest: '/allcomments/'+req.params.postID });
                        }
                      } else { // didnot like
                        //already favorited 
                        if (favoriteArray.indexOf(req.params.postID) > -1) {
                          res.render('otherspost', {username: creater.username, 
                            postPicSrc: "/post/"+req.params.postID,
                            likenum: post.likes.length, 
                            postID: req.params.postID, 
                            heartBtnClass: 'heartbutton',
                            rate: rate,
                            date: date,
                            caption: caption, 
                            favorite: 'Remove From Fravorites',
                            commentUserProfile: commentUserProfileArray,
                            commentProfilePic: commentProfilePicArray,
                            commentCreater: commentUsernameArray,
                            commentDate: commentDateArray, 
                            commentContent: commentContentArray,
                            allcommentsrequest: '/allcomments/'+req.params.postID });
                        } else {
                          res.render('otherspost', {username: creater.username, 
                            postPicSrc: "/post/"+req.params.postID,
                            likenum: post.likes.length, 
                            postID: req.params.postID, 
                            heartBtnClass: 'heartbutton',
                            rate: rate,
                            date: date,
                            caption: caption, 
                            favorite: 'Save To Favorites',
                            commentUserProfile: commentUserProfileArray,
                            commentProfilePic: commentProfilePicArray,
                            commentCreater: commentUsernameArray,
                            commentDate: commentDateArray, 
                            commentContent: commentContentArray,
                            allcommentsrequest: '/allcomments/'+req.params.postID});
                        }
                      }
                    });
                  });
                }
              });
            });
          });
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
          Post.getComments(req.params.postID, function (commentsIDArray) {
            Comment.find({'_id': {$in: commentsIDArray}}, function (err, commentData) {
              var commentUsernameArray = [];
              var commentProfilePicArray = [];
              var commentContentArray = [];
              var commentUserProfileArray = [];
              var commentDateArray = [];
              var commentStart = commentData.length - 10;
              if (commentStart < 0) {
                commentStart = 0;
              }
              for (var i = commentStart; i < commentData.length; i++) {
                commentUsernameArray[i - commentStart] = commentData[i].username;
                commentContentArray[i - commentStart] = commentData[i].content;
                commentProfilePicArray[i - commentStart] = '/profilePic/' + commentData[i - commentStart].author;
                commentUserProfileArray[i - commentStart] = '/userprofile/' + commentData[i - commentStart].author;
                var comDate = new Date(commentData[i - commentStart].created_at);
                commentDateArray[i - commentStart] = comDate.toDateString() + ' ' + comDate.getHours() +':' + comDate.getMinutes();
              }
              var rate = Number(post.rating);
              var caption = post.caption;
              var date = new Date(post.created_at);
              date = date.toDateString() + ' ' + date.getHours() +':' + date.getMinutes();

              if (likerArray.indexOf(user._id) > -1) {
                res.render('mypost', {username: req.session.username, 
                  postPicSrc: "/post/"+req.params.postID,
                  likenum: post.likes.length, 
                  postID: req.params.postID, 
                  heartBtnClass: 'heartbutton like', 
                  rate: rate, 
                  date: date,
                  caption: caption, 
                  commentUserProfile: commentUserProfileArray,
                  commentProfilePic: commentProfilePicArray,
                  commentCreater: commentUsernameArray,
                  commentDate: commentDateArray, 
                  commentContent: commentContentArray, 
                  allcommentsrequest: '/allcomments/'+req.params.postID});
              } else { // didnot like 
                res.render('mypost', {username: req.session.username, 
                  postPicSrc: "/post/"+req.params.postID,
                  likenum: post.likes.length, 
                  postID: req.params.postID, 
                  heartBtnClass: 'heartbutton',
                  rate: rate,
                  date: date,
                  caption: caption,
                  commentUserProfile: commentUserProfileArray,
                  commentProfilePic: commentProfilePicArray,
                  commentCreater: commentUsernameArray,
                  commentDate: commentDateArray, 
                  commentContent: commentContentArray,
                  allcommentsrequest: '/allcomments/'+req.params.postID});
              }
           });
          });
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
});

router.post('/postpic/favorite', function (req, res) {
  User.findOne({username: req.session.username}, function (err, me) {
    var myID = me._id;
    User.getFavorites(req.session.username, function (favoriteArray) {
      // look at othersprofile/follow for explanation
      if (favoriteArray.indexOf(req.body.postID) > -1) {
        User.unfavorite(myID, req.body.postID, function (err) {
          if (err) {
            res.send('error' + err);
          } else {
            res.send('ok');
          }
        });
      } else {
      // look at othersprofile/follow for explanation
        User.favorite(myID, req.body.postID, function (err) {
          if (err) {
            res.send('error' + err);
          } else {
            res.send('ok');
          }
        });
      }
    });
  });
});


router.post('/postpic/comment', function (req, res) {
  Comment.addComment(req.session.username, req.body.postID, req.body.commentContent, function (err) {
    if (err) {
      res.send('error' + err);
    } else {
      User.findOne({username: req.session.username}, function (err, user) {
        res.send(user);
      });
    }
  });
});

router.get('/allcomments/:postID', function (req, res) {
  Post.getComments(req.params.postID, function (commentsIDArray) {
    Comment.find({'_id': {$in: commentsIDArray}}, function (err, commentData) {
      var commentUsernameArray = [];
      var commentProfilePicArray = [];
      var commentContentArray = [];
      var commentUserProfileArray = [];
      var commentDateArray = [];
      for (var i = 0; i < commentData.length; i++) {
        commentUsernameArray[i] = commentData[i].username;
        commentContentArray[i] = commentData[i].content;
        commentProfilePicArray[i] = '/profilePic/' + commentData[i].author;
        commentUserProfileArray[i] = '/userprofile/' + commentData[i].author;
        var comDate = new Date(commentData[i].created_at);
        commentDateArray[i] = comDate.toDateString() + ' ' + comDate.getHours() +':' + comDate.getMinutes();
      }
      res.render('allcomments', {commentUserProfile: commentUserProfileArray,
                            commentProfilePic: commentProfilePicArray,
                            commentCreater: commentUsernameArray,
                            commentDate: commentDateArray, 
                            commentContent:commentContentArray});
    });
  });
});

module.exports = router;
