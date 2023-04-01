const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const guildData = require("../../../Schemas/Guild")
const { Guild } = require("../../../config/config")
const ms = require("ms")
const cekilis = require("../../../Schemas/Giveaway")
module.exports = {
  config: {
    name: "giveaway",
    description: "giveaway",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    let Datas = await guildData.findOne({guildID: Guild.ID})

if(!Datas.serverFounders.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(cevaplar.noyt);
let zaman = args[0]
let kazanan = args[1]
let odul = args.slice(2).join(" ");
let arr = [];
if (!zaman) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} Lütfen komutu doğru kullanın! \`.çekiliş 5m 1 Spotify\`` })
if (!kazanan) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} Lütfen komutu doğru kullanın! \`.çekiliş 5m 1 Spotify\`` })
if (isNaN(kazanan)) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} Lütfen komutu doğru kullanın! \`.çekiliş 5m 1 Spotify\`` })
if (kazanan > 1) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} Şuanlık sadece 1 kazanan belirleyebilirsiniz!` })
if (!odul) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} Lütfen komutu doğru kullanın! \`.çekiliş 5m 1 Spotify\`` })
let sure = ms(zaman)
let kalan = Date.now() + sure
if (message) message.delete();
const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder().setCustomId("katil").setEmoji("1042456439861559376").setStyle(ButtonStyle.Primary)
)
let msg = await message.channel.send({
  embeds: [new EmbedBuilder().setColor("2F3136").setThumbnail(message.guild.iconURL())
.setTitle(`${odul}`)
.setFooter({text: `${kazanan} Kazanan!`})
.setDescription(`
Çekiliş başladı! Aşağıdaki butona basarak katılabilirsiniz!
Çekilişi Başlatan : ${message.author}
Bitiş Zamanı : <t:${Math.floor(kalan / 1000)}:R>
    `)], components: [row]
})

setTimeout(() => {
  if (arr.length <= 1) {
    if (msg) msg.edit({
      embeds: [new EmbedBuilder().setTitle(`${odul}`).setColor("2F3136").setThumbnail(message.guild.iconURL()).setDescription(`
Çekilişe katılım olmadığından çekiliş iptal edildi!
`)], components: []
    })
    return;
  }
  let random = arr[Math.floor(Math.random() * arr.length)]
  message.channel.send({ content: `<@${random}> tebrikler kazandın!` })
  if (msg) msg.edit({
    embeds: [new EmbedBuilder().setTitle(`${odul}`).setColor("2F3136").setThumbnail(message.guild.iconURL()).setFooter({ text: `${arr.length} katılımcı!`}).setDescription(`
Çekiliş sonuçlandı! 
Çekilişi Başlatan : ${message.author} 
Kazanan : <@${random}>
                `)], components: []
  })
}, sure)

var filter = (component) => component.user.id === message.author.id;
const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 })
collector.on('collect', async (button) => {
  button.deferUpdate(true)
  if (button.customId == "katil") {
    let tikdata = await cekilis.findOne({ messageID: button.message.id })
    if (tikdata?.katilan.includes(button.member.id)) return;
    await cekilis.findOneAndUpdate({ messageID: button.message.id }, { $push: { katilan: button.member.id } }, { upsert: true })
    arr.push(button.member.id)
    if (msg) msg.edit({
      embeds: [new EmbedBuilder().setColor("2F3136").setThumbnail(message.guild.iconURL()).setTitle(`${odul}`).setFooter({text: `${kazanan} Kazanan!`}).setDescription(`
Çekiliş başladı! Aşağıdaki butona basarak katılabilirsiniz!
Çekilişi Başlatan : ${message.author}
Katılan kişi sayısı : ${tikdata?.katilan.length + 1 || 1}
Bitiş Zamanı : <t:${Math.floor(kalan / 1000)}:R>
                        `)]
    })
  }
})
  }
}