var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');
var url = require('url') 
var randomstring = require("randomstring");
var bcrypt   = require('bcrypt-nodejs');
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

//create an admin
//update profile
router.post('/users', function(req, res){
     if(!req.user){
            res.render('login', { title: 'Login', message: req.flash('loginMessage')  });
        }

    var token = randomstring.generate();
     User.create({
            email : req.body.email,
          resetToken: token
        }, function(err, response) {
            if (err)
                res.send(err);

            var email = new sendgrid.Email({
                to: req.body.email,
                from: req.user.email,
                subject: 'New Account',
                html: 'You have been added as an Admin.<br>Please follow this link to create a password:<br><a href="http://'+url.hostname+'/user/reset/'+token+'">http://'+url.hostname+'/user/reset/'+token+'</a> '
            });
            sendgrid.send(email, function(err, json){
                if(err) { return console.error(err); }
                 res.render('users', { message:"Email invite sent", user: req.user,title: 'Users' });
            });

        });
});

//update profile
router.post('/users/update/:id', function(req, res){
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
        User.findOneAndUpdate(
            {_id : req.params.id}, 
            {email: req.body.email, password: newPassword }
            ).exec(function(err, db_res){
            if (err){ res.send(err)}
            res.render('profile', { message: 'Updated', user: db_res, title: 'Profile' });
        })
    }else{
        User.findOneAndUpdate(
            {_id : req.params.id}, 
            { email: req.body.email }
            ).exec(function(err, db_res){
            if (err){ res.send(err)}
            res.render('profile', { message: 'Updated', user: db_res, title: 'Profile' });
        })
    }
	
})


//gen random reset token and email user
router.post('/api/user/reset/:id', function(req, res){
	var token = randomstring.generate();
     User.findOneAndUpdate(
        {_id : req.params.id}, 
        {resetToken : token}
        ).exec(function(err, db_res){
        if (err){ res.send(err)}

        var email = new sendgrid.Email({
			to: db_res.email,
	    	from: db_res.email,
		    subject: 'Password Reset',
		    html: 'You have requested to reset your password. <br>Please follow this link to create a new password:<br><a href="http://'+url.hostname+'/user/reset/'+token+'">http://'+url.hostname+'/user/reset/'+token+'</a> '
		});
	    sendgrid.send(email, function(err, json){
		    if(err) { return console.error(err); }
		    console.log(json);
		});

        res.json(db_res);
    })

})

//take user to profile so they can reset password
router.get('/user/reset/:token', function(req, res){
  User.findOne({resetToken : req.params.token}, function(err, user) {
    if(err){
        res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    }

    if(!user){
    	var err = new Error('Not Found');
    	err.status = 404;
    	res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    	
    }
    res.render('profile', { message: req.flash('loginMessage'), user: user, title: 'Profile',reset: true });
            
  });


})

module.exports = router;