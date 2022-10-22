const router = require('express').Router();
const {
  getUsers,
  getUser,
  changeUserInfo,
  changeUserAvatar,
  getMe,
} = require('../controlles/user');

router.get('/me', getMe);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', changeUserInfo);
router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
