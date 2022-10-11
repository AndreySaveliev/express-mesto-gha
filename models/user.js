const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    required: true,
  },
  about: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 2,
  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
