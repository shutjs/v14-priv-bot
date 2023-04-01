const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const guildData = require("../../../Schemas/Guild")
const { Guild } = require("../../../config/config")
const loglar = [
    "priv-log",
]
module.exports = {
  config: {
    name: "vip",
    description: "vip",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    let Datas = await guildData.findOne({guildID: Guild.ID})
    if(!Datas.serverFounders.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Yetkin Bulunmuyor")
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return message.channel.send("Lütfen Bir Üye Belirtin " + ` \`.vip <#No/@shut/ID>\``), message.react(message.guild.emojiBul("Iptal"));
    if(message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send("Bu Üyenin Yetkisi Daha Büyük");
    if(uye.user.bot) return message.channel.send("Bu Kullanıcı Bot");
    let viprol= Datas.vipRole
    if(uye.roles.cache.has(viprol)) return message.channel.send("Bu Kişide Zaten Vip Rolü Var"), message.react(message.guild.emojiBul("Iptal"));
    uye.roles.add(viprol)
    message.reply(`${uye} Adlı kişiye başarıyla <@&${viprol}> Verildi`)
    message.react(message.guild.emojiBul("Onay"))
  }
}