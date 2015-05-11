var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  email: String
});

mongoose.model('User', UserSchema);

