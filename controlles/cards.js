const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умолчинию' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner }, { new: true, runValidators: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      res.status(500).send({ message: 'Ошибка по умолчинию' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove({ _id: cardId }, { new: true, runValidators: true })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчинию' });
      }
    });
};

const putLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate({ _id: cardId }, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчинию' });
      }
    });
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate({ _id: cardId }, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (card === null) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчинию' });
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
