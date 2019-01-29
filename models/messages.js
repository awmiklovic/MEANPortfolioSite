var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  To: String,
  From: String,
  message: String,
  name: String
},
{
	timestamps: true
});


mongoose.model('Message', MessageSchema);