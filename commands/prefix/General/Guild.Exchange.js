const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const guildData = require("../../../Schemas/Guild")
const { Guild } = require("../../../config/config")
const loglar = [
    "priv-log",
]
module.exports = {
  config: {
    name: "kur",
    description: "kur",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config) => {
    let Data = guildData.findOne({guildID: Guild.ID})
    let Data2 = guildData.findOne({guildID: Guild.ID})
    let Datas = await guildData.findOne({guildID: Guild.ID})
    if(!Datas.serverFounders.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Yetkin Bulunmuyor")

    let embed = new EmbedBuilder()
    .setTitle("Sunucunun Kurulum Bölümüne Hoşgeldin")
    .setDescription(`\`\`\`css\nAşşağıdaki kısımdan yapmak istediğin işlemi seçebilirsin!\`\`\``)
    .setThumbnail(message.guild.iconURL())
    .setColor("2F3136")

    let ayarksıım = new ActionRowBuilder().addComponents(
     new StringSelectMenuBuilder()
     .setCustomId(`kategoriler`)
     .setPlaceholder(`Lütfen Kategori Seçiniz`)
     .addOptions(
         {
             label: `Emoji Kurulum`,
             description: `Emoji Kurulumunu Yap`,
             value:`emoji`
         },
         {
            label: `Log Kurulum`,
            description: `Log Kurulumunu Yap`,
            value:`log`
        },
         {
             label: 'Özel Oda Kurulum',
             description: `Özel Oda Kurulumu Yap`,
             value: 'ozeloda',
         },
     )
  )
let mesaj = await message.channel.send({embeds: [embed], components: [ayarksıım]})
var filter = (component) => component.user.id === message.author.id;
const collector = message.channel.createMessageComponentCollector({ filter, time: 30000 })
collector.on('collect', async (interaction) => {
   if (interaction.customId == "kategoriler") {
       if (mesaj) mesaj.delete();

   if (interaction.values[0] == "emoji") {
       const emojis = [
           { name: "Onay", url: "https://cdn.discordapp.com/emojis/1081226208857051156.gif?size=96&quality=lossless" },
           { name: "Iptal", url: "https://cdn.discordapp.com/emojis/1042439641049079890.gif?size=96&quality=lossless" },
       ]
       emojis.forEach(async (x) => {
           if (message.guild.emojis.cache.find((e) => x.name === e.name)) return;
           const emoji = await message.guild.emojis.create({ name: x.name, attachment: x.url });
           message.channel.send({ content: `\`${x.name}\` isimli emoji oluşturuldu! (${emoji.toString()})` });
       });
   } 
   if (interaction.values[0] == "log") {
    const log = await message.guild.channels.create({
        name: "SHUT_LOGS",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [{
            id: message.guild.roles.everyone.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
        }]
    });
    loglar.some(x => {
        message.guild.channels.create({
            name: x,
            type: ChannelType.GuildText,
            parent: log
        });
    })
    message.channel.send({ content: `${message.guild.emojiBul("Onay")} Başarılı bir şekilde \`Log Kurulumları\` başladı!` }).sil(100)

}
   if(interaction.values[0] == "ozeloda"){
    interaction.channel.send({ content: `${message.guild.emojiBul("Onay")} Özel oda kurulumu başladı. Lütfen biraz bekleyiniz!` }).sil(20)
            const everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
            const ozelOda = await message.guild.channels.create({
                name: `Özel Oda`,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: Datas?.mainRole,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ]
            }).then(async kanal => await Data2.findOneAndUpdate({ guildID: message.guild.id }, { $set: { ozelOdaVoice: kanal.id } }, { upsert: true }).exec())
            const ozelOdaText = await message.guild.channels.create({
                name: `Özel Oda Panel`,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: Datas?.mainRole,
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    }
                ]
            }).then(async kanal => await Data.findOneAndUpdate({ guildID: message.guild.id }, { $set: { ozelOdaTextt: kanal.id } }, { upsert: true }).exec())
            console.log(Datas)
            const panel = await message.guild.channels.create({
                name: `ozel-oda-olustur`,
                type: ChannelType.GuildText,
                parent: Datas.ozelOdaTextt,
                permissionOverwrites: [
                    {
                        id: everyone.id,
                        deny: [PermissionsBitField.Flags.SendMessages],
                    },
                ]
            }).then(async channel => {
                await channel.setParent(ozelOdaText, { lockPermissions: true })
                const ozelodas = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId("ozelodaolustur").setLabel("Özel Oda Oluştur").setStyle(ButtonStyle.Primary)
                )
                channel.send({
                    components: [ozelodas],
                    embeds: [embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) }).setDescription(`
\`\`\`diff
+ Sunucumuzda kendine özel bir ses kanalı oluşturabilir ve otomatik oluşturduğumuz yazı kanalından bu kanalı yönetebilirsin.
\`\`\`
\`\`\`fix
Oda limiti, girebilecek kişileri ve bir çok özelliği açtığımız kanal içerisinden ayarlayabilir ve kendine özel odada istediğin gibi takılabilirsin.
\`\`\`
\`\`\`diff
- Not Kanala belirli bir süre boyunca girmezsen kanalin otomatik olarak silinecektir!
\`\`\`

`).setTitle("Özel Oda Sistemine Hoşgeldin")]
                })
            });
}
}
})
  }
}