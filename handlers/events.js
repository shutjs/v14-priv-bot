const fs = require("fs");


module.exports = (client) => {
  console.log("Events Handler:".blue);
  
  fs.readdirSync('./events/').forEach(dir => {
		const commands = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
		for (let file of commands) {
      
			let pull = require(`../events/${dir}/${file}`);
			if (pull.name) {
				client.events.set(pull.name, pull);
				console.log(`[HANDLER - EVENTS] bir dosya yüklendi: ${pull.name}`.brightGreen)
			} else {
				console.log(`[HANDLER - EVENTS] dosya yüklenemedi ${file}. eksik ad veya takma adlar.`.red)
				continue;
			}
      
		}
	});
}