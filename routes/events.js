const express = require('express'),
  router = express.Router(),
  EventModel = require('../models/event'),
  { parseJwt, shouldAuth } = require('../middleware');

/* GET events. */
router
  .use(parseJwt, shouldAuth)
  .get('/', (req, res) => {
    const {
      payload: { user },
    } = req;

    EventModel.findByUserId(user._id)
      .exec()
      .then((events) => res.json(events))
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
  })
  .post('/', (req, res) => {
    const {
      payload: { user },
      body: { title, start, duration },
    } = req;

    EventModel.create({
      title,
      start,
      duration,
      idUser: user._id,
    })
      .then((event) => {
        res.json(event);
      })
      .catch((e) => {
        console.error(e);
        res.sendStatus(500);
      });
  });

module.exports = router;
