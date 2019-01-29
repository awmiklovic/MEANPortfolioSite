var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Ability = mongoose.model('Ability');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'NEWSecret',
  userProperty: 'payload'
});

router.get('/', function(req, res, next) {
  Ability.find(function(err, abilities){
    if(err){ return next(err); }

    res.json(abilities);
  });
});

router.post('/', auth, isAdmin, function(req, res){
	var ability = new Ability(req.body);

	ability.save(function(err, ability){
    	if(err){ return next(err); }
    	res.json(ability);
  	});

});

router.delete('/:ability', auth, isAdmin, function(req, res){
    Ability.remove({
      _id: req.ability._id
    }, function(err){
      if(!err){ res.json({message:"Deleted"});
      }
      else {
        res.json({message:"There was an error"});
      }
    });
});

router.param('ability', function(req, res, next, id) {
  var abilityquery = Ability.findById(id);

  abilityquery.exec(function (err, ability){
    if (err) { return next(err); }
    if (!ability) { return next(new Error('can\'t find post')); }

    req.ability = ability;
    return next();
  });
});

function isAdmin(req, res, next){
  if(!req.payload.admin){ return; }
  else { next(); }
}

module.exports = router;