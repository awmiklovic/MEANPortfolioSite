var express = require('express');
var router = express.Router();

var fs = require('fs');

var mongoose = require('mongoose');
var Project = mongoose.model('Project');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'NEWSecret',
  userProperty: 'payload'
});


router.get('/', function(req, res, next) {
  Project.find(function(err, projects){
    if(err){ return next(err); }

    res.json(projects);
  });
});

router.post('/', auth, isAdmin, function(req, res){

	var project = new Project(req.body);

	project.save(function(err, project){
  	if(err){ return next(err); }
  	res.json(project);
	});

});

router.delete('/:project', auth, isAdmin, function(req, res){
    Project.remove({
      _id: req.project._id
    }, function(err){
      if(!err){ res.json({message:"Deleted"});
      }
      else {
        res.json({message:"There was an error"});
      }
    });

    fs.unlink('./public/'+req.project.imgURL, (err) => {
      if (err) throw err;
  });
});

router.param('project', function(req, res, next, id) {
  var projectquery = Project.findById(id);

  projectquery.exec(function (err, project){
    if (err) { return next(err); }
    if (!project) { return next(new Error('can\'t find post')); }

    req.project = project;
    return next();
  });
});

function isAdmin(req, res, next){
  if(!req.payload.admin){ return; }
  else { next(); }
}

module.exports = router;