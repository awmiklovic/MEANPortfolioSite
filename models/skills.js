var mongoose = require('mongoose');

var SkillsSchema = new mongoose.Schema({
  name: String,
  imgURL: String,
  cat: String
});

mongoose.model('Skill', SkillsSchema);