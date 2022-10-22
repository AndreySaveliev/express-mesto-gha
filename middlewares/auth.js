const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'YANDEX' } = process.env;

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('Bearer')) {
    return res.status(401).send({ message: 'Необходимо авторизироваться' });
  }
  const token = cookie.replace('Bearer=', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизироваться' });
  }
  req.user = payload;
  next();
};
