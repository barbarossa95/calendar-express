const { Schema, model } = require('mongoose'),
  eventSchema = new Schema({
    title: String,
    start: Number,
    duration: Number,
    idUser: String,
  }),
  MODEL_NAME = 'Event';

eventSchema.statics = {
  findByUserId: function (idUser) {
    return this.find({ idUser });
  },
};

module.exports = model(MODEL_NAME, eventSchema);
