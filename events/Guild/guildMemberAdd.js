const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField, ChannelType, SelectMenuBuilder, Component } = require('discord.js');
const client = require("../../index");
const config = require("../../config/config.js");
const sunucuData = require("../../Schemas/Guild")

module.exports = {
  name: "guildMemberAdd"
};

client.on('guildMemberAdd', async (member) => {

let Data = await sunucuData.findOne({guildID: config.Guild.ID})
let uye = client.users.cache.get(member.id)
let chatchannel = client.channels.cache.get(Data.chatChannel)
let buton1 = new ButtonBuilder()
.setCustomId(`selam`)
.setLabel(`Selam Ver!`)
.setStyle(ButtonStyle.Primary)
.setEmoji("753957083644166194")
let row = new ActionRowBuilder().addComponents(
    buton1
)

chatchannel.send({content: `**Hey Aramıza Biri Katıldı <@${member.id}> Selam Ver!**`, components: [row]}).sil(10)

const collector = chatchannel.createMessageComponentCollector({})
collector.on('collect', async (interaction) => {
    if(interaction.customId === "selam"){
        interaction.reply(`**<@${uye.id}>, <@${interaction.user.id}> Sana Selam Verdi!**`)
      }
  })
})