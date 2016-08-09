const mongoose = require('mongoose');
const Promise = require('bluebird');

const singleImage = new mongoose.Schema({
  filename: String,
  votes: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const SingleImage = mongoose.model('SingleImage', singleImage);

Promise.promisifyAll(SingleImage);

module.exports = {
  SingleImage
};
