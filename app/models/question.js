// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  text: String,
  group: {type: String, default: 'eBay'},
  creator: String
});

QuestionSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Question', QuestionSchema);

