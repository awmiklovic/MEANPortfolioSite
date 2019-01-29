var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');


//Include auth middleware for routes that require authentication
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'NEWSecret',
  userProperty: 'payload',
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

//List all posts
router.get('/', function(req, res, next) {
  Home.find({}, function(err, docs) {
    if (!err){ 
        console.log(docs);
    } else {throw err;}
  });
});

//Create a new post
router.post('/', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

//Get a post by ID
router.get('/:post', function(req, res) {
	req.post.populate('comments', function(err, post) {
    	if (err) { return next(err); }

    	res.json(post);
	});
});

//Delete a post by ID
router.delete('/:post', function(req, res){
	Post.remove({
		_id: req.post._id
	}, function(err){
		if(!err){ res.json({message:"Deleted"});
		}
		else {
			res.json({message:"There was an error"});
		}
	});
});

//Add upvotes to a post
router.put('/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

//Add upvotes to a comment
router.put('/:post/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

//Add comments
router.post('/:post/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

//List all comments a for a specific post
router.get('/:post/comments/:comment', function(req, res){
	res.json(req.comment);
});

//Define router parameters
router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.param('comment', function(req, res, next, id) {
  var commentquery = Comment.findById(id);

  commentquery.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

module.exports = router;