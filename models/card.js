const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        if (v) {
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+~#?&/=]*)/.test(v);
        }
      },
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  likes: {
    default: [],
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
