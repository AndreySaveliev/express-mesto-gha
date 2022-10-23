const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require('../models/user');
const Error400 = require('../Errors/Error400');
const Error404 = require('../Errors/Error404');
const Error401 = require('../Errors/Error401');
const Error409 = require('../Errors/Error409');
require('dotenv').config();

const { JWT_SECRET = 'YANDEX' } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
          __v: user.__v,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Error409('Пользователь с таким email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        throw new Error400('Переданы некорректные данные');
      }
      next(err);
    }));
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        throw new Error404('Пользователь с указанным _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new Error400('Передан не корректное значение _id');
      }
      next(err);
    });
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new Error404('Пользователь с указанным _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw Error400('Переданы некорректные данные');
      }
      next(err);
    });
};

const changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user === null) {
        throw new Error404('Пользователь с указанным _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new Error400('Переданы некорректные данные');
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user === null) {
        throw new Error401('Неправильные почта или пароль');
      }
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Error401('Неправильные почта или пароль');
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: '7d',
        });
        res.cookie('Bearer ', token, {
          maxAge: 3600 * 24 * 7,
          httpOnly: true,
        });
        return res.send({ data: user });
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        throw new Error404('Пользователь с указанным _id не найден.');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new Error400('Передан не корректное значение _id');
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  changeUserAvatar,
  changeUserInfo,
  login,
  getMe,
};
