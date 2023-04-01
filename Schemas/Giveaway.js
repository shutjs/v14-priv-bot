const mongoose = require("mongoose");
const schema = mongoose.model("cekilis", mongoose.Schema({
     messageID: String,
      katilan: Array, 
      time: String, }))
module.exports = schema;