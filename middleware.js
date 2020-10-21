const jwt = require('jsonwebtoken');

exports.parseJwt = (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(' ');

    jwt.verify(token, process.env.EXPRESS_AUTH_SECRET, (error, payload) => {
      if (error) {
        console.error('Request auth fail');

        return next();
      }

      if (payload) {
        req.payload = payload;
        req.token = token;

        return next();
      }

      return next();
    });
  } catch (e) {
    console.error(e);

    return next();
  }
};

exports.shouldAuth = (req, res, next) => {
  if (req.token) {
    return next();
  } else {
    res.sendStatus(401).end();
  }
};
