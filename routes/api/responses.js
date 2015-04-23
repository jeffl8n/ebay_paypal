var express = require('express');
var router = express.Router();
var path = require('path');



var Response = mongoose.model('Response',{
  text: String,
  group: String,
  catagory: String,
  learner: String,
  question: String,
  votes: {type: Number, default: 1},
  when: {type: Date, default: Date.now}
});
     // get one response
    router.get('/:response_id', function(req, res) {

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
    router.get('/', function(req, res) {

        // use mongoose to get all responses in the database
        Response.find(function(err, responses) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(responses); // return all responses in JSON format
        });
    });
    // get all responses for a question
    router.get('/qid/:question_id', function(req, res) {

        // use mongoose to get all responses in the database
        Response.find({'question' : req.params.question_id},function(err, responses) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(responses); // return all responses in JSON format
        });
    });
    
    // get all responses for a question
    router.get('/count/:question_id', function(req, res) {
        var cat_obj = [];
       var get_count = function(idx){
         Response.count({'question' : req.params.question_id, 'catagory': global.catagories[idx]},function(err, count) {
                if (err)
                    res.send(err)
                cat_obj.push({key: global.catagories[idx], y:count})
                //color: global.catagoryColors[idx]
                if(idx <= global.catagories.length-2){
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
     // get all responses in a catagory for a question 
    router.get('/qid/:question_id/:catagory', function(req, res) {

        // use mongoose to get all responses in the database
        Response.find({'question' : req.params.question_id,'catagory' : req.params.catagory},function(err, responses) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(responses); // return all responses in JSON format
        });
    });

    // create response and send back all responses after creation
    router.post('/', function(req, res) {

        // create a response, information comes from AJAX request from Angular
        Response.create({
            text : req.body.text,
          group: req.body.group,
          learner: req.body.learner,
          question: req.body.question,
          catagory: req.body.catagory,
            done : false
        }, function(err, response) {
            if (err)
                res.send(err);

            // get and return all the responses after you create another
            Response.find({'question' : req.body.question, 'catagory': req.body.catagory},function(err, responses) {

                if (err)
                    res.send(err)
                res.json(responses);
            });
        });

    });
     // vote up/down response
    router.post('/vote/:response_id', function(req, res) {
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
    router.delete('/vote/:response_id', function(req, res) {
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
    router.delete('/:response_id', function(req, res) {
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