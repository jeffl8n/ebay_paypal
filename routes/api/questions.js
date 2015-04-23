var express = require('express');
var router = express.Router();
var path = require('path');


var Question = global.mongoose.model('Question',{
  text: String,
  group: {type: String, default: 'eBay'},
  creator: String
});

// get one question
    router.get('/:question_id', function(req, res) {

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
    router.get('/', function(req, res) {

        // use mongoose to get all questions in the database
        Question.find(function(err, questions) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(questions); // return all questions in JSON format
        });
    });
    // create question and send back all questions after creation
    router.post('/', function(req, res) {

        // create a question, information comes from AJAX request from Angular
        Question.create({
            text : req.body.text,
            done : false
        }, function(err, question) {
            if (err)
                res.send(err);

            // get and return all the questions after you create another
            Question.find(function(err, questions) {
                if (err)
                    res.send(err)
                res.json(questions);
            });
        });

    });
    module.exports = router;