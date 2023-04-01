const client = require("../../index");
const colors = require("colors");
const system = require("../../config/config")
const shut = require("../../Schemas/Guild")
module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  setInterval(async () => {
    const shutxd = await shut.findOne({ guildID: system.Guild.ID })
    const voice = require("@discordjs/voice")
    const channel = client.channels.cache.get(shutxd?.botVoice);
    if(channel){
    voice.joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfMute: true,
    });
  }
}, 1000 * 3)
  console.log("\n" + `[READY] ${client.user.tag} kalktı ve gitmeye hazır hadi uç`.brightGreen);
})