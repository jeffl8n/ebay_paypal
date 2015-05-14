var mongoose = require('mongoose'),
Schema = mongoose.Schema, 
bcrypt   = require('bcrypt-nodejs');

var UserSchema = new Schema({
  password: String,
  email: String,
  resetToken: String,
  isAdmin: Boolean
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
  console.log(password);
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  console.log(password);
  return bcrypt.compareSync(password, this.password);
};

// checking if password is valid
UserSchema.methods.company = function() {

  return this.email.substring(this.email.indexOf('@')+1,this.email.indexOf('.'));
};

mongoose.model('User', UserSchema);

