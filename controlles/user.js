const { response } = require('express');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка по умолчинию' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (name === '' || about === '' || avatar === '') {
    res
      .status(400)
      .send({
        message: 'Переданы некорректные данные при создании пользователя.',
      });
    return;
  }
  User.create({ name, about, avatar }, { runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      console.log(err.name)
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчинию' });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
        return;
      }
      res.status(500).send({
        message: 'Ошибка по умолчинию.',
      });
    });
};

const changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (avatar === '') {
    res
      .status(400)
      .send({
        message: 'Переданы некорректные данные при обновлении аватара.',
      });
    return;
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчинию' });
      }
    });
};

const changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  if (name === '' || about === '') {
    res.status(404).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    return;
  }
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчинию' });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  changeUserAvatar,
  changeUserInfo,
};
