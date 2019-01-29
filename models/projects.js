var mongoose = require('mongoose');

var ProjectsSchema = new mongoose.Schema({
  name: String,
  imgURL: String,
  desc: String,
  link: String
});

mongoose.model('Project', ProjectsSchema);