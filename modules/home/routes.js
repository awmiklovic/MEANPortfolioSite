var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Home = mongoose.model('Home');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'NEWSecret',
  userProperty: 'payload'
});

router.get('/', function(req, res, next){
	Home.find(function(err, home){
		if(err) { return next(err) }
		res.json(home);
	});
});

router.put('/', auth, isAdmin, function(req, res, next){
	console.log(req.body);
	console.log(req.payload.admin);
	Home.find(function(err, home){
		if(err) {return next(err) }
		Home.update({_id:"57db00d5c936ba6e67cf7d0f"}, req.body)
		.then(function(success){
			res.json(success);
		});
	});
});

function isAdmin(req, res, next){
	if(!req.payload.admin){ return; }
	else { next(); }
}

module.exports = router;