var express = require('express');
var router = express.Router();
var path = require('path');

//router.use(express.static(path.join(__dirname, 'public')));
router.get('/', function(req, res) {
	//res.render('index', { title: 'Express' });
        res.render('journal/questions', { title: 'Express' });
    });

router.get('/:question_id', function(req, res) {
        res.render('journal/question', { qid: req.params.question_id });
    });


module.exports = router;