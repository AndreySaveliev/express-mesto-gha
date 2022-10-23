const express = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controlles/user');
const auth = require('./middlewares/auth');
const Error404 = require('./Errors/Error404');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9]{1,256}\.[a-zA-Z0-9]{1,6}[a-zA-Z0-9._~:/?#[\]@!$&()*+,;=-]{1,256}$/),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use(errors());

app.use('*', (req, res, next) => {
  next(new Error404('Такого пути не существует'));
});

app.use((err, req, res) => {
  console.log(err);
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Ошибка по умолчинию' });
  }
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
