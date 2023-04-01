const mongoose = require("mongoose");

const PrivRoom = mongoose.model('PrivRoom', new mongoose.Schema({
    userID: String,
    vChannelID: String,
    tChannelID: String,
    leaveDate: { type: Number, default: Date.now() }
  }))

  module.exports = PrivRoom;