const Card = require('../models/card');
const Error400 = require('../Errors/Error400');
const Error404 = require('../Errors/Error404');
const Error403 = require('../Errors/Error403');
const Error401 = require('../Errors/Error401');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create([{ name, link, owner }], { new: true })
    .then((card) => res.send({ data: card[0] }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card === null) {
        throw new Error404('Не удалось найти карточку');
      }
      if (card.owner.toString() === req.user._id) {
        Card.deleteOne()
          .then(res.send({ data: card }));
      } else {
        throw new Error403('Вы не можете удалять карточки других пользователей.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error401('Переданы некорректные данные для удаления карточки.'));
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
        throw new Error404('Карточка с указанным _id не найдена.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные для постановки/снятии лайка.'));
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
        throw new Error404('Карточка с указанным _id не найдена.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорректные данные для постановки/снятии лайка.'));
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
