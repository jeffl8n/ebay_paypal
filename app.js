var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };

//Op#z@jZPtb7vtw%c
//var mongodbUri = 'mongodb://journalDB:journalDB@ds060977.mongolab.com:60977/journal-db';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri, options);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

global.mongoose = mongoose
global.catagories = ['Culture','Money','Innovation','Career Advancement', 'Other']
global.catagoryColors = ['#3071A9','#5cb85c','#5bc0de','#f0ad4e', '#d9534f']

var routes = require('./routes/index');
var users = require('./routes/users');
var questions = require('./routes/questions');
var api_questions = require('./routes/api/questions');
var api_responses = require('./routes/api/responses');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/questions', questions);
app.use('/api/questions', api_questions);
app.use('/api/responses', api_responses);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      var message = JSON.stringify(err, ['stack', 'message'], 2)
      console.error(message)
      res.status(err.status || 500);
      res.render('error', {
      message: message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var message = JSON.stringify(err, ['stack', 'message'], 2)//remove
      console.error(message)//remove
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


/*
var port = process.env.PORT || 1337;
var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
*/
module.exports = app //function(app, mongoose) { };
