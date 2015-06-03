var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var flash    = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(app, config) {
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.use(expressSession({secret: 'S3Mg1wyXa&jtMA^Ljvehh9TFmj&502qxlQcHEN91F1Nkj4%h4Rja4wjdphB7O4hmA7dcmPuTAP5wO1nR5g!BRpwpz^CXt95lUqGm'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {

    process.nextTick(function() {
      User.findOne({ 'email' :  email }, function(err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }   

        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();
          newUser.email    = email;
          newUser.password = newUser.generateHash(password);
          newUser.isAdmin = req.body.isAdmin;
          newUser.save(function(err) {
            if (err) {
              console.log(err);
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) { 
    User.findOne({ 'email' :  email }, function(err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }          

      if (!user) {
        console.log ('user not found');
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }

      if (!user.validPassword(password)) {
        console.log ('wrong password');
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }

      return done(null, user);
    });

  }));

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });



  var questions_api = require(config.root + '/app/controllers/api/questions');
  var responses_api = require(config.root + '/app/controllers/api/responses');
  var users_api = require(config.root + '/app/controllers/api/users');
  app.use(questions_api);
  app.use(responses_api);
  app.use(users_api);

global.ebayColors = [
{catagory:'Culture', color: '#3071A9'},
{catagory:'Innovation', color: '#5cb85c'},
{catagory:'Opportunity', color: '#5bc0de'},
{catagory:'People', color: '#f0ad4e'},
{catagory:'Other', color: '#d9534f'},
{catagory:'PayPal', color: '#3071A9'},
{catagory:'Square', color: '#d9534f'},
{catagory:'Payflow-Link', color: '#d9534f'},
{catagory:'Payflow-Pro', color: '#5cb85c'},
{catagory:'all', color: '#000'}
];

global.paypalColors = [
{catagory:'Culture', color: '#003087'},
{catagory:'Innovation', color: '#009CDE'},
{catagory:'Opportunity', color: '#B0008E'},
{catagory:'People', color: '#7AE1BF'},
{catagory:'Other', color: '#99999A'},
{catagory:'PayPal', color: '#003087'},
{catagory:'Square', color: '#99999A'},
{catagory:'Payflow-Link', color: '#99999A'},
{catagory:'Payflow-Pro', color: '#009CDE'},
{catagory:'all', color: '#000'}
];

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

};
