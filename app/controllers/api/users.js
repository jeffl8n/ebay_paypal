var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var config = require('../../../config/config')

var User = mongoose.model('User');

var sendgrid = require('sendgrid')(config.sg.username, config.sg.password);

// get all admins
    router.get('/api/users/', function(req, res) {

        // use mongoose to get all responses in the database
        User.find(function(err, responses) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(responses); // return all responses in JSON format
        });
    });

//test of sending an email. 
//TO-DO: Gen random password and set it. Then send email to user
router.get('/api/user/password/:id', function(req, res){
	var email = new sendgrid.Email({
	    to: 'james@builtclean.com',
	    from: 'james@builtclean.com',
	    subject: 'test mail',
	    text: 'This is a sample email message.'
	});
	sendgrid.send(email, function(err, json){
	    if(err) { return console.error(err); }
	    console.log(json);
	});
})

module.exports = router;