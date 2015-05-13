var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');

var Response = mongoose.model('Response');

     // get one response
    router.get('/api/responses/:response_id', function(req, res) {

        // use mongoose to get response in the database
        Response.findOne(function(err, response) {
            _id : req.params.response_id
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(response); // return response in JSON format
        });
    });

    // get all responses
    router.get('/api/responses/', function(req, res) {

        // use mongoose to get all responses in the database
        Response.find(function(err, responses) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(responses); // return all responses in JSON format
        });
    });

    router.get('/api/moderate/responses/', function(req, res) {

        // use mongoose to get all responses in the database
        Response.find({'text': {$ne: null}},function(err, responses) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(responses); // return all responses in JSON format
        });
    });


    // get all responses for a question
    router.get('/api/responses/qid/:question_id', function(req, res) {

        // use mongoose to get all responses in the database
        Response.find({'question' : req.params.question_id, 'text': {$ne: null}},function(err, responses) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(responses); // return all responses in JSON format
        });
    });
    
    // get all responses for a question
    router.get('/api/responses/count/:question_id', function(req, res) {
        var cat_obj = [];
       var get_count = function(idx){
         Response.count({'question' : req.params.question_id, 'category': global.categories[idx]},function(err, count) {
                if (err)
                    res.send(err)
                cat_obj.push({key: global.categories[idx], y:count})
                //color: global.categoryColors[idx]
                if(idx <= global.categories.length-2){
                    setTimeout(function(){
                        idx++
                        get_count(idx);
                    }, 25)
                }else{
                    res.json(cat_obj);
                }

            });
       
        
       }
       get_count(0)
        
    });
     // get all responses in a category for a question 
    router.get('/api/responses/qid/:question_id/:category', function(req, res) {

        // use mongoose to get all responses in the database
        Response.find({'question' : req.params.question_id,'category' : req.params.category},function(err, responses) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(responses); // return all responses in JSON format
        });
    });

    // create response and send back all responses after creation
    router.post('/api/responses/', function(req, res) {

        // create a response, information comes from AJAX request from Angular
        Response.create({
            text : req.body.text,
          group: req.body.group,
          learner: req.body.learner,
          question: req.body.question,
          category: req.body.category,
            done : false
        }, function(err, response) {
            if (err)
                res.send(err);

            // get and return all the responses after you create another
            //removed category filter from sql so angular can filter it , 'category': req.body.category
            Response.find({'question' : req.body.question},function(err, responses) {

                if (err)
                    res.send(err)
                res.json(responses);
            });
        });

    });

    //update a response
    router.post('/api/responses/:response_id', function(req, res) {
        Response.findOneAndUpdate(
            {_id : req.params.response_id}, 
            {text : req.body.text}
            ).exec(function(err, db_res){
            if (err)
                    res.send(err)
                res.json(db_res);
        })
    });

     // vote up/down response
    router.post('/api/responses/vote/:response_id', function(req, res) {
        console.log('votting for ', req.params.response_id)
        Response.findOneAndUpdate(
            {_id : req.params.response_id}, 
            {$inc: {'votes': 1}}
            ).exec(function(err, db_res){
            if (err)
                    res.send(err)
                res.json(db_res);
        })
    });
    router.delete('/api/responses/vote/:response_id', function(req, res) {
        console.log('votting for ', req.params.response_id)
        Response.findOneAndUpdate(
            {_id : req.params.response_id}, 
            {$inc: {'votes': -1}}
            ).exec(function(err, db_res){
            if (err)
                    res.send(err)
                res.json(db_res);
        })
    });

// delete a response
    router.delete('/api/responses/:response_id', function(req, res) {
        Response.remove({
            _id : req.params.response_id
        }, function(err, response) {
            if (err)
                res.send(err);

            // get and return all the responses after you create another
            Response.find(function(err, responses) {
                if (err)
                    res.send(err)
                res.json(responses);
            });
        });
    });


    module.exports = router;