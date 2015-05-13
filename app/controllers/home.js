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

router.get('/', function (req, res, next) {
  Question.find(function (err, questions) {
    if (err) return next(err);
    res.render('index', {
      title: 'Home',
      questions: questions
    });
  });
});


router.get('/login', function(req, res) {
  res.render('login', { title: 'Login', message: req.flash('loginMessage')  });
});

router.post('/login',
  passport.authenticate('local-login', { successRedirect: '/questions',
   failureRedirect: '/login' 
 })
);

router.get('/profile', isAuthenticated, function(req, res) {
  res.render('profile.ejs', {
    title: 'Profile',
    user : req.user // get the user out of session and pass to template
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

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
router.get('/createadmin', isAdmin, function(req,  res) {
  res.render('createadmin',  { message: req.flash('loginMessage') ,  title: 'Create Admin'});
});


router.post('/createadmin', isAdmin, passport.authenticate('local-signup', {
                successRedirect :  '/profile', // redirect to the secure profile section
                failureRedirect :  '/createadmin', // redirect back to the signup page if there is an error
                failureFlash : true  // allow flash messages
              }));


