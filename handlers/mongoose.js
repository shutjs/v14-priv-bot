const config = require("../config/config.js");
const mongoose = require('mongoose');
const mongo = config.Handlers.MONGO;

module.exports = (client) => {
	mongoose.set(`strictQuery`, true);
	mongoose.connect(mongo, {
	  useNewUrlParser: true,
	  useUnifiedTopology: true
	}).then(() => {
	  setTimeout(() => {
		console.log(`[MongoDB]: Ağ ile bağlantı kuruldu.`)
	  }, 3000);
	}).catch((err) => {
	  console.log(`[MongoDB]: Bağlantı kurulamadı. Hata alındı!\n>> [HATA]: ${err}`)
	});
};


