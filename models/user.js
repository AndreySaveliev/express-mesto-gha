const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    minlength: 2,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    maxlength: 30,
    minlength: 2,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        if (v) {
          /https?:\/\/(www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9]{1,6}[a-zA-Z0-9._~:/?#[\]@!$&()*+,;=-]{1,256}$/.test(v);
        }
      },
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
