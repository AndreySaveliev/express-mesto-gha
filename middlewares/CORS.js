const allowedDom = [
  'http://saveliev.nomoredomains.icu',
];
module.exports = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedDom.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
};
