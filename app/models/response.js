var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  text: String,
  group: String,
  category: String,
  location: String,
  learner: String,
  question: String,
  votes: {type: Number, default: 1},
  flags:{type: Number, default: 0},
  when: {type: Date, default: Date.now}
});

ResponseSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

mongoose.model('Response', ResponseSchema);

