const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require('../models/user');
const AuthError = require('../Errors/AuthError');
const NotFoundError = require('../Errors/NotFoundError');
const RequestError = require('../Errors/RequestError');
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
  if (email === undefined || password === undefined) {
    throw new RequestError('Ведите корректное данные.');
  }
  if (validator.isEmail(email)) {
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
        if (err.name === 'ValidationError') {
          err.message = 'Переданы некорректные данные';
        }
        next(err);
      }));
  } else {
    throw new RequestError('Введите email');
  }
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с указанным _id не найден.', 404);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Передан не корректное значение _id';
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
        throw new NotFoundError('Пользователь с указанным _id не найден.', 404);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        err.message = 'Переданы некорректные данные';
        next(err);
      } else {
        next(err);
      }
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
        throw new NotFoundError('Пользователь с указанным _id не найден.', 404);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        err.message = 'Переданы некорректные данные';
        next(err);
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user === null) {
        throw new AuthError('Неправильные почта или пароль', 401);
      }
      bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError('Неправильные почта или пароль', 401);
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
      if (err.name === 'CastError') {
        err.message = 'Переданы некорректные данные';
      } else {
        next(err);
      }
    });
};

const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с указанным _id не найден.', 404);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Передан не корректное значение _id';
        next(err);
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
