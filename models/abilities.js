var mongoose = require('mongoose');

var AbilitySchema = new mongoose.Schema({
  name:String,
  desc:String
});


mongoose.model('Ability', AbilitySchema);