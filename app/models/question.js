var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  text: String,
  group: {type: String, default: 'ebay'},
  categories: Array,
  locations: Array,
  type: String,
  creator: String
});

QuestionSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Question', QuestionSchema);

