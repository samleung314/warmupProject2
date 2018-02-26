// db.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://samleung:samleung@ds147668.mlab.com:47668/warmup2');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to Mongoose!");
//   var User = require('./user/User');

//   var newUser = new User({
//       name: 'Connected1!',
//       email: 'Connected2!',
//       password: 'Connected3!'
//   });

//   newUser.save(function(err, newUser) {
//       if(err) return console.error(err);
//       else console.log("User Saved!");
//   });
});