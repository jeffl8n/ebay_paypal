var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  email: String,
  gender: String,
  address: String
});

mongoose.model('User', UserSchema);

