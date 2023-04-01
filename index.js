const { Client, Partials, Collection, GatewayIntentBits, IntentsBitField} = require('discord.js');
const Discord = require("discord.js")
const config = require('./config/config');
const serverData = require("./Schemas/Guild")
const { Guild } = require("./config/config")
const { joinVoiceChannel } = require('@discordjs/voice');
const guilData = require("./Schemas/Guild")

const client = new Client({
  intents:[
    Object.keys(IntentsBitField.Flags)
  ],
  partials:[
    Object.keys(Partials)
  ],
  presence: {
    activities: [{
      name: "Shut ❤️ Esalet",
      type: 0
    }],
    status: 'idle'
  }
});

const discordModals = require('discord-modals'); // Define the discord-modals package!
discordModals(client);
guildac();
require('http').createServer((req, res) => res.end('Ready.')).listen(3000);


const AuthenticationToken = config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn("[HATA] Discord botu için Kimlik Doğrulama Jetonu gereklidir!".red)
  return process.exit();
};


client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "modals", "events", "mongoose"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});


client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[HATA] Botunuza bağlanırken bir sorun oluştu...");
    console.error("[HATA] Discord API'sinden gelen hata:" + err);
    return process.exit();
  });


process.on('unhandledRejection', async (err, promise) => {
  console.error(`[HATA] İşlenmemiş Reddetme: ${err}`.red);
  console.error(promise);
});



Discord.Guild.prototype.kanalBul = function (chanelName) {
  let channel = this.channels.cache.find(k => k.name === chanelName)
  return channel;
}
Discord.Guild.prototype.emojiBul = function (content) {
  let emoji = this.emojis.cache.find(e => e.name === content) || this.emojis.cache.find(e => e.id === content)
  if (!emoji) return console.log(`${content} emojisi ${this.name} sunucusuna yüklenmediğinden kullanılamadı.`, "error");
  return emoji;
}
Promise.prototype.sil = function (time) {
  if (this) this.then(message => {
    if (message.deletable)
      setTimeout(() => message.delete(), time * 1000)
  });
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};



async function guildac(){
  let guilddata = await serverData.findOne({guildID: Guild.ID})
if(config.Client.ID){
  if(!guilddata){
    let newServer = new serverData({
      guildID: Guild.ID
    }).save();
    console.log("Veritabanında Olmayan Sunucu Başarıyla Oluşturuldu")
   }
 }
}

