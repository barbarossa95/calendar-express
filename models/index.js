const mongoose = require('mongoose');

const connectDb = () => {
  return mongoose.connect(process.env.MONGODB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  });
};

module.exports = connectDb;
