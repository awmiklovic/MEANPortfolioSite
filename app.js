var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

require('./models/posts');
require('./models/comments');
require('./models/user');
require('./models/skills');
require('./models/home');
require('./models/abilities');
require('./models/projects');
require('./models/messages');

require('./config/passport');


var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./modules/post/server/routes');
var skills = require('./modules/skills/server/routes');
var home = require('./modules/home/routes');
var ability = require('./modules/abilities/routes');
var projects = require('./modules/projects/routes');

var mongoose = require('mongoose');
var passport = require('passport');



var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/news');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use('/', routes);
app.use('/users', users);
app.use('/posts', posts);
app.use('/skills', skills);
app.use('/home', home);
app.use('/ability', ability);
app.use('/projects', projects)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
