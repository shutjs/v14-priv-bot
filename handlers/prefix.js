const fs = require("fs");
const colors = require("colors");

module.exports = (client, config) => {
  console.log("Prefix Handler:".blue);

  fs.readdirSync('./commands/prefix/').forEach(dir => {
    const commands = fs.readdirSync(`./commands/prefix/${dir}`).filter(file => file.endsWith('.js'));
    for (let file of commands) {

      let pull = require(`../commands/prefix/${dir}/${file}`);
      if (pull.config.name) {
        client.prefix_commands.set(pull.config.name, pull);
        console.log(`[HANDLER - PREFIX] Bir Dosya Yüklendi: ${pull.config.name} (#${client.prefix_commands.size})`.brightGreen)
      } else {
        console.log(`[HANDLER - PREFIX] Dosya Yüklenemedi ${file}, Eksik Modül Adı Değeri.`.red)
        continue;
      };

    };
  });
};
