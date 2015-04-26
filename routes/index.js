var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Journal' });
});

/* GET home page. */
router.get('/monkey', function(req, res, next) {
  res.render('monkey');
});


module.exports = router;
