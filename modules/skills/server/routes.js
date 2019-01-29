var express = require('express');
var router = express.Router();

var fs = require('fs');

var mongoose = require('mongoose');
var Skill = mongoose.model('Skill');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'NEWSecret',
  userProperty: 'payload'
});


router.get('/', function(req, res, next) {
  Skill.find(function(err, skills){
    if(err){ return next(err); }

    res.json(skills);
  });
});

router.post('/', auth, isAdmin, function(req, res){

	var skill = new Skill(req.body);

	skill.save(function(err, skill){
    	if(err){ return next(err); }
    	res.json(skill);
  	});

});

router.delete('/:skill', auth, isAdmin, function(req, res){
    Skill.remove({
      _id: req.skill._id
    }, function(err){
      if(!err){ res.json({message:"Deleted"});
      }
      else {
        res.json({message:"There was an error"});
      }
    });

    fs.unlink('./public/'+req.skill.imgURL, (err) => {
      if (err) throw err;
  });
});

router.param('skill', function(req, res, next, id) {
  var skillquery = Skill.findById(id);

  skillquery.exec(function (err, skill){
    if (err) { return next(err); }
    if (!skill) { return next(new Error('can\'t find post')); }

    req.skill = skill;
    return next();
  });
});

function isAdmin(req, res, next){
  if(!req.payload.admin){ return; }
  else { next(); }
}

module.exports = router;