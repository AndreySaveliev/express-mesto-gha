const allowedDom = [
  'http://saveliev.nomoredomains.icu',
];
module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  if (allowedDom.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
};
