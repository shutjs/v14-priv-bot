const mongoose = require("mongoose");

const dcvote = mongoose.model(
  "Setup",
  new mongoose.Schema({
    guildID: {
      type: String,
    },
    guildUrl: {
      type: String,
    },
    botVoice: {
      type: String,
    },
    serverFounders: {
      type: Array,
    },
    vipRole: {
      type: String,
    },
    mainRole: {
      type: String,
    },
    boosterRole: {
      type: String,
    },
    chatChannel: {
      type: String
    },
    ozelOdaVoice: {
      type: String,
    },
    ozelOdaTextt: {
      type: String,
    },
  })
);

module.exports = dcvote;
