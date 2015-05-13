var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  passport = require('passport'),
  Question = mongoose.model('Question');
  flash    = require('connect-flash');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', isAuthenticated, function (req, res, next) {
   res.render('index', { title: 'Home' });
});


router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.post('/login',
  passport.authenticate('local-login', { successRedirect: '/',
                                   failureRedirect: '/login' }));

router.get('/questions', isAuthenticated, function(req, res) {
  res.render('questions', { title: 'Questions' });
});

//this is public
router.get('/questions/:question_id', function(req, res) {
  res.render('question', { title: 'Question', qid: req.params.question_id });
});

router.get('/responses', isAuthenticated, function(req, res) {
  res.render('responses', { title: 'Responses' });
});

router.get('/users', isAuthenticated, function(req, res) {
  res.render('users', { title: 'Users' });
});

router.get('/profile', isAuthenticated, function(req, res) {
  res.render('profile', { message: req.flash('loginMessage'), user: req.user, title: 'Profile' });
});

//TO-DO: need to protect this later
router.get('/createadmin', function(req,  res) {
                res.render('createadmin',  { message: req.flash('loginMessage') ,  title: 'Create Admin'});
});


router.post('/createadmin',  passport.authenticate('local', {
                successRedirect :  '/', // redirect to the secure profile section
                failureRedirect :  '/createadmin', // redirect back to the signup page if there is an error
                failureFlash : true  // allow flash messages
}));


