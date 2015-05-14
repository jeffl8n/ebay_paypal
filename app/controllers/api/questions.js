var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var Question = mongoose.model('Question');

    // get one question
    router.get('/api/questions/:question_id', function(req, res) {

        // use mongoose to get all questions in the database
        Question.findOne(function(err, question) {
            _id : req.params.question_id
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(question); // return all questions in JSON format
        });
    });

    // get all questions
    router.get('/api/questions/', function(req, res) {
        if(!req.user){
            res.json({'error':'unauthorized'})
        }
        // use mongoose to get all questions in the database
        Question.find({'group': req.user.company()},function(err, questions) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(questions); // return all questions in JSON format
        });
    });
    // create question and send back all questions after creation
    router.post('/api/questions/', function(req, res) {
        if(!req.user){
            res.json({'error':'unauthorized'})
        }
        // create a question, information comes from AJAX request from Angular
        Question.create({
            text : req.body.text,
            group: req.user.company(),
            done : false
        }, function(err, question) {
            if (err)
                res.send(err);

            // get and return all the questions after you create another
            Question.find({'group': req.user.company()},function(err, questions) {
                if (err)
                    res.send(err)
                res.json(questions);
            });
        });

    });
    module.exports = router;