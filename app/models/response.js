// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  text: String,
  group: String,
  category: String,
  learner: String,
  question: String,
  votes: {type: Number, default: 1},
  when: {type: Date, default: Date.now}
});

ResponseSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Response', ResponseSchema);

