const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require('../models/user');
const AuthError = require('../Errors/AuthError');
const NotFoundError = require('../Errors/NotFoundError');
const RequestError = require('../Errors/RequestError');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => next(err));

  // {
  //   res.status(500).send({ message: 'Ошибка по умолчинию' });
  // });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (email === undefined || password === undefined) {
    throw new RequestError('Ведите корректное данные.');
  }
  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          res.send({ data: user });
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
        throw new NotFoundError('Пользователь с указанным _id не найден.');
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        // return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(400).send({
        //   message: 'Передан не корректное значение _id',
        // });
        err.message = 'Передан не корректное значение _id';
      }
      next(err);
      // res.status(500).send({
      //   message: 'Ошибка по умолчинию.',
      // });
    });
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        // return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        err.message = 'Переданы некорректные данные';
        next(err);
        // res
        //   .status(400)
        //   .send({ message: 'Переданы некорректные данные' });
      } else {
        next(err);
        // res.status(500).send({ message: 'Ошибка по умолчинию' });
      }
    });
};

const changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        // return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        err.message = 'Переданы некорректные данные';
        next(err);
        // res.status(400).send({
        //   message: 'Переданы некорректные данные. ',
        // });
      } else {
        next(err);
        // res.status(500).send({ message: 'Ошибка по умолчинию' });
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new AuthError('Неправильные почта или пароль', 401);
        // return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль', 400);
            // return res.status(401).send({ message: 'Неправильные почта или пароль' });
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
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
        // res.status(400).send({
        //   message: 'Переданы некорректные данные',
        // });
      } else {
        next(err);
        // res.status(500).send({ message: 'Ошибка по умолчинию' });
      }
    });
};

const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
        // res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        // return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Передан не корректное значение _id';
        next(err);
        // res.status(400).send({
        //   message: 'Передан не корректное значение _id',
        // });
        // return;
      }
      next(err);
      // res.status(500).send({
      //   message: 'Ошибка по умолчинию.',
      // });
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
