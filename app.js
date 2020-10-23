const express = require('express'),
  { json, urlencoded } = express,
  authRouter = require('./routes/auth'),
  eventsRouter = require('./routes/events'),
  pino = require('express-pino-logger'),
  cors = require('cors'),
  app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(pino());
app.use(cors());

app.get('/', (req, res) => {
  res.sendStatus(201);
});
app.use('/auth', authRouter);
app.use('/events', eventsRouter);

// redirect all to main
app.use((req, res, next) => res.redirect('/'));

module.exports = app;
