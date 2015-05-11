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
  Question.find(function (err, questions) {
    if (err) return next(err);
    res.render('index', {
      title: 'EBay Questions',
      questions: questions
    });
  });
});


router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));

router.get('/questions', isAuthenticated, function(req, res) {
  res.render('questions', { title: 'Questions' });
});

router.get('/questions/:question_id', isAuthenticated, function(req, res) {
  res.render('question', { title: 'Question', qid: req.params.question_id });
});

router.get('/responses', isAuthenticated, function(req, res) {
  res.render('responses', { title: 'Responses' });
});


router.get('/createadmin', function(req,  res) {
                res.render('createadmin',  { message: req.flash('loginMessage') ,  title: 'Create Admin'});
});


router.post('/createadmin',  passport.authenticate('local', {
                successRedirect :  '/', // redirect to the secure profile section
                failureRedirect :  '/createadmin', // redirect back to the signup page if there is an error
                failureFlash : true  // allow flash messages
}));


