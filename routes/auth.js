const express = require('express'),
  router = express.Router(),
  UserModel = require('../models/user'),
  { parseJwt, shouldAuth } = require('../middleware');

router
  .post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      validationFailed(res);
    }

    UserModel.register(username, password)
      .then(UserModel.createToken)
      .then(({ user, token }) =>
        res.json({
          token,
          user: user.safe(),
        })
      )
      .catch((e) => {
        console.error(e);
        res.status(400).json({ message: e.message });
      });
  })
  .post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      validationFailed(res);
    }

    UserModel.checkCredentials(username, password)
      .then(UserModel.createToken)
      .then(({ token, user }) => {
        return res.json({
          token,
          user: user.safe(),
        });
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({ message: e.message });
      });
  })
  .get('/me', parseJwt, shouldAuth, (req, res) => res.json(req.payload.user));

const validationFailed = (res) => {
  res
    .status(400)
    .json({ message: 'username and password are required fields' });
};

module.exports = router;
