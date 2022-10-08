const router = require('express').Router();
const {
  getCards, deleteCard, createCard, putLike, deleteLike,
} = require('../controlles/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
