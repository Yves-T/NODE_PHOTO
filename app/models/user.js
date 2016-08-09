const mongoose = require('mongoose');
const Promise = require('bluebird');

// define the schema for our user model
var userSchema = new mongoose.Schema({
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
    profilePic: String
  }
});

const User = mongoose.model('User', userSchema);

Promise.promisifyAll(User);

// create the model for users and expose it to our app
module.exports = {
  User
};
