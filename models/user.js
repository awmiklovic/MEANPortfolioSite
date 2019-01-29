var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	imgURL: String,
	firstName: String,
	lastName: String,
	email: {type: String, unique: true},
	company: String,
	position: String,
	testimonial: {
		testimonialBody: String,
		approved: Boolean
	},
	hash: String,
	salt: String,
	admin: Boolean
});

UserSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

UserSchema.methods.generateJWT = function(){
// Set expiration to 60 days
	var today = new Date();
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);
	console.log('generating Token');

	return jwt.sign({
		_id: this._id,
		email: this.email,
		admin: this.admin,
		exp: parseInt(exp.getTime() / 1000),
	}, 'NEWSecret');
};

mongoose.model('User', UserSchema);