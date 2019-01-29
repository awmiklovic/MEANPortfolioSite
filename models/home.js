var mongoose = require('mongoose');

var HomeSchema = new mongoose.Schema({
	header:{
		headshot:String,
		tagline:String,
		age:Number,
		email:String,
		phone:String,
		desc:String
	},
	about:{
		title:String,
		desc:String
	}
});


mongoose.model('Home', HomeSchema);