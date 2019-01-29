var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Messages = mongoose.model('Message');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'NEWSecret',
  userProperty: 'payload'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  	User.find(function(err, user){
		if(err) { return next(err) }
		res.json(user);
	});
});


//Get a post by ID
router.get('/:user', function(req, res) {
	res.json(req.user);
});

router.put('/:user', auth, function(req ,res){
	User.update({email: req.user.email}, req.body)
	.then(function(success){
		res.json(success);
	});
})

router.delete('/:userId', auth, isAdmin, deleteMessages, function(req, res){
	User.remove({_id: req.user._id}, function(err, resp){
		if(err) return;
		else res.json(resp);
	});
})

//Define router parameters
router.param('user', function(req, res, next, user) {
  var query = User.findOne({email: user});

  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find post')); }
    
    req.user = user;
    return next();
  });
});

router.param('userId', function(req, res, next, user) {
  var query = User.findOne({_id: user});

  query.exec(function (err, user){
    if (err) { return next(err); }
    if (!user) { return next(new Error('can\'t find post')); }
    
    req.user = user;
    return next();
  });
});

function deleteMessages(req, res, next){
    Messages.remove({ $or: [ {From: req.user.email}, {To: req.user.email} ]}, function(){
        return next();
    });
}

function isAdmin(req, res, next){
  if(!req.payload.admin){ return; }
  else { next(); }
}

module.exports = router;
