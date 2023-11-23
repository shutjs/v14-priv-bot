const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField } = require('discord.js');
const guildData = require("../../../Schemas/Guild")
const { Guild } = require("../../../config/config")
module.exports = {
  config: {
    name: "setup",
    description: "Setup",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    let Data = guildData.findOne({guildID: Guild.ID})
    let Datas = await guildData.findOne({guildID: Guild.ID})
    if(!Datas.serverFounders.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Yetkin Bulunmuyor")

      let arg = args[0];
      if(!arg){
      let embed = new EmbedBuilder()
      .setTitle("Sunucunun Ayar Bölümüne Hoşgeldin")
      .setDescription(`\`\`\`css\nAşşağıdaki kısımdan yapmak istediğin işlemi seçebilirsin!\`\`\``)
      .setThumbnail(message.guild.iconURL())
      .setColor("2F3136")
      
     let ayarksıım = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
        .setCustomId(`kategoriler`)
        .setPlaceholder(`Lütfen Kategori Seçiniz`)
        .addOptions(
            {
                label: `Sunucu Ayarları`,
                description: `${message.guild.name} Sunucu Ayarları`,
                value:`sunucu`
            },
        )
     )
     message.channel.send({embeds: [embed], components: [ayarksıım]})
     var filter = (component) => component.user.id === message.author.id;
     const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 })
     collector.on('collect', async (interaction) => {
     if (interaction.customId == "kategoriler") {
        if (interaction.values[0] == "sunucu") {
            interaction.reply({
                embeds: [new EmbedBuilder()
                   .setTitle("Kanal Ayarları")
                   .setColor("2F3136")
                   .setThumbnail(message.guild.iconURL())
                   .setDescription(`
Bot Ses kanalı : ${Datas?.botVoice ? `<#${Datas?.botVoice}>` : `${message.guild.emojiBul("Iptal")}`} (\`.setup botseskanal <Kanal/ID>\`)
Chat kanalı : ${Datas?.chatChannel ? `<#${Datas?.chatChannel}>` : `${message.guild.emojiBul("Iptal")}`} (\`.setup chatchannel <Kanal/ID>\`)
Sunucu Url : ${Datas?.guildUrl ? Datas?.guildUrl : `${message.guild.emojiBul("Iptal")}`} (\`.setup url <Url>\`)
Sunucu Sahibi Rolü : ${Datas?.serverFounders ? `${Datas?.serverFounders.map(x => `<@&${x}>`).join(", ")}` : `${message.guild.emojiBul("Iptal")}`} (\`.setup serverFounders <Rol/ID>\`)
Vip rolü : ${Datas?.vipRole ? `<@&${Datas?.vipRole}>` : `${message.guild.emojiBul("Iptal")}`} (\`.setup vipRol <Rol/ID>\`)
Main Rol (Üye Rolü) : ${Datas?.mainRole ? `<@&${Datas?.mainRole}>` : `${message.guild.emojiBul("Iptal")}`} (\`.setup mainRol <Rol/ID>\`)
Booster Rol : ${Datas?.boosterRole ? `<@&${Datas?.boosterRole}>` : `${message.guild.emojiBul("Iptal")}`} (\`.setup booster <Rol/ID>\`)
`)
                ]
            })
        }
       }
     })
    }
    if (["vipRol"].some(x => arg == x)) {
        let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
        if (!rol) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} ${message.author} Rol Giriniz` })
        await Data.findOneAndUpdate({ guildID: message.guild.id }, { $set: { vipRole: rol.id } }, { upsert: true }).exec();
        message.channel.send({ content: `${message.guild.emojiBul("Onay")} ${message.author} başarılı bir şekilde **${arg}** ayarı ${rol} olarak ayarlandı!` })
       }
       if (["mainRol"].some(x => arg == x)) {
        let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
        if (!rol) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} ${message.author} Rol Giriniz` })
        await Data.findOneAndUpdate({ guildID: message.guild.id }, { $set: { mainRole: rol.id } }, { upsert: true }).exec();
        message.channel.send({ content: `${message.guild.emojiBul("Onay")} ${message.author} başarılı bir şekilde **${arg}** ayarı ${rol} olarak ayarlandı!` })
       }  
       if (["booster"].some(x => arg == x)) {
        let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(''));
        if (!rol) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} ${message.author} Rol Giriniz` })
        await Data.findOneAndUpdate({ guildID: message.guild.id }, { $set: { boosterRole: rol.id } }, { upsert: true }).exec();
        message.channel.send({ content: `${message.guild.emojiBul("Onay")} ${message.author} başarılı bir şekilde **${arg}** ayarı ${rol} olarak ayarlandı!` })
       }
       if (["url"].some(x => arg == x)) {
        let metin = args.splice(1).join(" ");
        if (!metin) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} ${message.author} Bir URL belirtmeyi unuttun!` }).sil(5);
        await Data.findOneAndUpdate({ guildID: message.guild.id }, { $set: { guildUrl: metin } }, { upsert: true }).exec();
        message.channel.send(`${message.guild.emojiBul("Onay")} Başarılı bir şekilde \`URL\` config dosyasına **${metin}** olarak ayarlandı!`)
    }
    if (["serverFounders"].some(x => arg == x)) {
        let roller;
            if (message.mentions.roles.size >= 1)
                roller = message.mentions.roles.map(role => role.id);
            else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
            if (roller.length <= 0) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} ${message.author} Rol Gir` })
            await Data.findOneAndUpdate({ guildID: message.guild.id }, { $set: { serverFounders: roller } }, { upsert: true }).exec();
            message.channel.send({ content: `${message.guild.emojiBul("Onay")} ${message.author} başarılı bir şekilde **${arg}** ayarı ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} olarak ayarlandı!` })
    }
    if (["botseskanal"].some(x => arg == x)) {
        let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
        if (!channel) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} ${message.author} Lütfen Kanal Berirleyin` })
        let kanal = await Data.findOneAndUpdate({ guildID: message.guild.id }, { $set: { botVoice: channel.id } }, { upsert: true })
        message.channel.send({ content: `${message.guild.emojiBul("Onay")} ${message.author} başarılı bir şekilde **${arg}** ayarını ${channel} olarak ayarladım!` })
    }
    if (["chatchannel"].some(x => arg == x)) {
      let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
      if (!channel) return message.channel.send({ content: `${message.guild.emojiBul("Iptal")} ${message.author} Lütfen Kanal Berirleyin` })
      let kanal = await Data.findOneAndUpdate({ guildID: message.guild.id }, { $set: { chatChannel: channel.id } }, { upsert: true })
      message.channel.send({ content: `${message.guild.emojiBul("Onay")} ${message.author} başarılı bir şekilde **${arg}** ayarını ${channel} olarak ayarladım!` })
  }
  }
}
  
