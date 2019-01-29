var express = require('express');
var router = express.Router();
var fs = require('fs');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    service:'gmail',
    auth: {
      user:"awmiklovic@gmail.com",
      pass:"vzdkqebdpjoayfxc"
    }
}));

var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Skill = mongoose.model('Skill');
var Message = mongoose.model('Message');

var passport = require('passport');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
});

var upload = multer({ storage: storage })

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'NEWSecret',
  userProperty: 'payload'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
	if(!req.body.email || !req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User(req.body);
	user.setPassword(req.body.password);
	user.save(function(err){
		if(err){
			console.log(err.message);
			return next(err);
		}
		return res.json({token: user.generateJWT()});
	});

});

router.post('/login', function(req, res, next){
	if(!req.body.username || !req.body.password){ return res.status(400).json({message:'Please fill out all fields'});}

	console.log(req.body);

	passport.authenticate('local', function(err, user, info){
		if(err){return next(err);}
		if(user){
			return res.json({token: user.generateJWT()});
		} else {
			return res.status(401).json(info);
		}
	}) (req, res, next);
});

router.post('/uploads', auth, upload.single('file'), function(req,res,next){
    console.log('Upload Successful ', req.file, req.body);
    return res.json(req.file);
});

router.get('/testimonial/approved', function(req, res, next){
	User.find({'testimonial.approved': true}, function(err, docs) {
    if (!err){ 
        res.json(docs);
    } else {throw err;}
  });
});

router.get('/testimonial/unapproved', function(req, res, next){
	User.find({'testimonial.approved': false}, function(err, docs) {
    if (!err){ 
        res.json(docs);
    } else {throw err;}
  });
});

router.put('/testimonial/:user', auth, isAdmin, function(req, res, next){
	User.update({email: req.user}, { $set: { 'testimonial.approved': true}})
	.then(function(success){
		res.json(success);
	});
});

router.post('/messages/:user', auth, getUsername, function(req, res, next){
	var message = new Message(req.body);

  message.name = req.name;
  message.To = req.user;
	message.save(function(err, message){
    if(err){ return next(err); }
    res.json(message);
  });
});

router.get('/messages', auth, function(req, res, next){
  Message.find({}, function(err, docs) {
    if (!err){ 
        res.json(docs);
    } else {throw err;}
  });
});

router.get('/messages/:user', auth, function(req, res, next){
  Message.find({ $or:[{ "To" : req.user}, {"From" : req.user} ] }, function(err, docs){
    if(!err){
      res.json(docs);
    } else {throw err;}
  });
});

router.param('user', function(req, res, next, email){
	req.user = email;
	return next();
});

router.post('/mailer', auth, function(req,res,next){
	transporter.sendMail({
	  from: 'awmiklovic@gmail.com',
	  to: req.body.recipient,
	  subject: req.body.subject,
	  text: req.body.message
	}, function (err, response) {
	  console.log(err || response);
	});
});

function getUsername(req, res, next){
  User.findOne({email: req.body.From}, function(err, docs){
    if(!err){
      req.name = docs.firstName;
      return next();
    } else {throw err;}
  });
}

function isAdmin(req, res, next){
  if(!req.payload.admin){ return; }
  else { next(); }
}

function test(req, res, next){
  console.log(req.body);
  next();
}


module.exports = router;
