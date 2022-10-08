const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    require: true,
  },
  about: {
    type: String,
    require: true,
    maxlength: 30,
    minlength: 2,
  },
  avatar: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('user', userSchema);
