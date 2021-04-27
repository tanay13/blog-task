var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model('user', UserSchema);

module.exports = User;
