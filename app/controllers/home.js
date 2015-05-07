var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Question = mongoose.model('Question');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Question.find(function (err, questions) {
    if (err) return next(err);
    res.render('index', {
      title: 'EBay Questions',
      questions: questions
    });
  });
});

router.get('/questions', function(req, res) {
  res.render('questions', { title: 'Questions' });
});

router.get('/questions/:question_id', function(req, res) {
  res.render('question', { title: 'Question', qid: req.params.question_id });
});

router.get('/responses', function(req, res) {
  res.render('responses', { title: 'Responses' });
});