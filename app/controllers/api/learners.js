var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose = require('mongoose');

var Learner = mongoose.model('Learner',{
  lmsID: String,
  email: String,
});
    module.exports = router;