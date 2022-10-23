const jwt = require('jsonwebtoken');
const Error401 = require('../Errors/Error401');

const { JWT_SECRET = 'YANDEX' } = process.env;

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('Bearer')) {
    throw new Error401('Необходимо авторизироваться');
  }
  const token = cookie.replace('Bearer=', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Error401('Необходимо авторизироваться'));
  }
  req.user = payload;
  next();
};
