const Card = require('../models/card');
const AuthError = require('../Errors/AuthError');
const NotFoundError = require('../Errors/NotFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
      // res.status(500).send({ message: 'Ошибка по умолчинию' });
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create([{ name, link, owner }], { new: true })
    .then((card) => res.send({ data: card[0] }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        err.message = ' Переданы некорректные данные при создании карточки';
        next(err);
        // res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        // return;
      }
      next(err);
      // res.status(500).send({ message: 'Ошибка по умолчинию' });
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove({ _id: cardId }, { new: true, runValidators: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка с указанным _id не найдена.', 404);
      }
      if (req.user._id !== card.owner.toString()) {
        throw new AuthError('Вы не можете удалять карточки других пользователей.', 403);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Переданы некорректные данные для удаления карточки.';
      } else {
        next(err);
      }
    });
};

const putLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate({ _id: cardId }, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка с указанным _id не найдена.', 404);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Переданы некорректные данные для постановки/снятии лайка.';
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Карточка с указанным _id не найдена.', 404);
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        err.message = 'Переданы некорректные данные для постановки/снятии лайка.';
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
