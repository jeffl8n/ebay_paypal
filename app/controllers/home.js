var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
passport = require('passport'),
Question = mongoose.model('Question');
flash    = require('connect-flash');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    console.log('authenticated');
    return next();
  }
  console.log('not authenticated');
  res.redirect('/login');
}

var isAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect('/login');
}

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', isAuthenticated, function (req, res, next) {
   res.render('index', {  user: req.user,title: 'Home' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Login', message: req.flash('loginMessage')  });
});

router.post('/login',
  passport.authenticate('local-login', { successRedirect: '/',
   failureRedirect: '/login' 
 })
);


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/questions', isAuthenticated, function(req, res) {
  res.render('questions', {  user: req.user,title: 'Questions' });
});

//this is public
router.get('/questions/:question_id', function(req, res) {
  res.render('question', { title: 'Question', qid: req.params.question_id });
});

router.get('/quad/:question_id', function(req, res) {
  res.render('quad', { title: 'Question', qid: req.params.question_id });
});

router.get('/binary/:question_id', function(req, res) {
  res.render('binary', { title: 'Question', qid: req.params.question_id });
});



router.get('/responses', isAuthenticated, function(req, res) {
  res.render('responses', {  user: req.user,title: 'Responses' });
});

router.get('/users', isAuthenticated, function(req, res) {
  res.render('users', { user: req.user,title: 'Users' });
});

router.get('/profile', isAuthenticated, function(req, res) {
  res.render('profile', { message: req.flash('loginMessage'), user: req.user, title: 'Profile' });
});



