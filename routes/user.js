const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUser,
  changeUserInfo,
  changeUserAvatar,
} = require('../controlles/user');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUser);
router.patch('/me', changeUserInfo);
router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
