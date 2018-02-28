// User.js
var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  username: String,
  email: String,
  password: String,
  key: String,
  verified: false,
  games: [{id: Number, start_date: String, grid: Array, winner: String}]
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');