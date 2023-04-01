const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const guildData = require("../../../Schemas/Guild")
const { Guild } = require("../../../config/config")
module.exports = {
  config: {
    name: "say",
    description: "say",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    let boosterdata = await guildData.findOne({guildID: Guild.ID})
      if(!boosterdata.boosterRole) return message.channel.send("Setup Tamamlanmamış")
      let say = await message.channel.send({embeds: [new EmbedBuilder().setDescription(`
**Sunucumuzda toplam ${message.guild.memberCount} kişi bulunmakta.**
**Sunucumuz da ${message.guild.members.cache.filter(u => u.presence && u.presence.status !== "offline").size} aktif kişi bulunmakta.   **    
**Ses kanallarında ${message.guild.members.cache.filter(x => x.voice.channel).size} adet kullanıcı bulunmaktadır.**
**Sunucumuzu boostlayan ${message.guild.roles.cache.get(boosterdata.boosterRole).members.size} üye bulunmakta.**
`)
.setColor("2F3136")
.setThumbnail(message.guild.iconURL())
.setFooter({text: `Dcvote ❤️`})

]
    })
  }
}