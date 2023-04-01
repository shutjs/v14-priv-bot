const client = require("../../index");
const config = require("../../config/config.js");
const sunucuData = require("../../Schemas/Guild")

const { Modal, TextInputComponent, showModal } = require("discord-modals");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, PermissionsBitField, ChannelType, SelectMenuBuilder } = require('discord.js');
const PrivRoom = require("../../Schemas/PrivRoom");
const { PermissionFlagsBits } = require("discord-api-types/v9");


module.exports = {
  name: "interactionCreate"
};

client.on('interactionCreate', async (interaction) => {
  let Data = await sunucuData.findOne({guildID: config.Guild.ID})
  let PrivData = await PrivRoom.findOne({userID: interaction.member.id})
  if (interaction.customId == "ozelodaolustur") {
    const st = await PrivRoom.findOne({ userID: interaction.member.id });
    if (st || st?.channelID) return interaction.reply({ content: `Bir odaya sahipken başka bir oda oluşturamazsın!`, ephemeral: true })
    let roomNumber = getRandomInt(1, 1000)
    const OdaAyarlari = new Modal()
                  .setCustomId(`${interaction.member.id}ozelOda_Modal${roomNumber}`)
                  .setTitle('Özel Oda Ayarları;')
                  .addComponents(new TextInputComponent()
                      .setCustomId('ozelOda_name')
                      .setLabel('Özel Odanızın İsmi ;')
                      .setStyle('SHORT')
                      .setMinLength(2)
                      .setMaxLength(15)
                      .setPlaceholder('Örn: Cumali Priv')
                      .setRequired(true),
                      new TextInputComponent()
                          .setCustomId('ozelOda_limit')
                          .setLabel('Oda limiti')
                          .setStyle('SHORT')
                          .setMinLength(1)
                          .setMaxLength(2)
                          .setPlaceholder('1 - 99 arası')
                          .setRequired(true)
                  );


              showModal(OdaAyarlari, {
                  client: client,
                  interaction: interaction
              });
              client.on('modalSubmit', async (modal) => {
                if (modal.customId === `${interaction.member.id}ozelOda_Modal${roomNumber}`) {
                  const firstResponse = modal.getTextInputValue('ozelOda_name')
                  const secondResponse = modal.getTextInputValue('ozelOda_limit')
                  let vkat = Data.ozelOdaVoice
                  let mkat = Data.ozelOdaTextt
                  let member = modal.member;
                  let guild = client.guilds.cache.get(interaction.guild.id)
                  let everyone = guild.roles.everyone;
                  let voice = await guild.channels.create(
                      {
                          name: `${firstResponse}`,
                          type: ChannelType.GuildVoice,
                          
                          parent: vkat,
                          userLimit: secondResponse,
                          permissionOverwrites: [
                              {
                                  id: everyone.id,
                                  allow: [PermissionsBitField.Flags.ViewChannel],
                                  deny: [PermissionsBitField.Flags.Connect]
                              },
                              {
                                  id: member.id,
                                  allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.MuteMembers, PermissionsBitField.Flags.DeafenMembers, PermissionsBitField.Flags.Stream, PermissionsBitField.Flags.Connect]
                              }
                          ]
                      })

                  let text = await guild.channels.create(
                      {
                          name: `${firstResponse}`,
                          type: ChannelType.GuildText,
                          parent: mkat,
                          permissionOverwrites: [
                              {
                                  id: everyone.id,
                                  deny: [PermissionsBitField.Flags.ViewChannel],
                              },
                              {
                                  id: member.id,
                                  allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                              }
                          ]
                      })
                  await modal.deferReply({ ephemeral: true })
                  modal.followUp({ content: `Merhaba! <#${voice.id}> adlı kanalın oluşturuldu! Yönetmen için sana bir de <#${text.id}> kanalını oluşturdum!` })
                  const row = new ActionRowBuilder()
                      .addComponents(
                          new SelectMenuBuilder()
                              .setCustomId('ozelodayonetim')
                              .setPlaceholder('Kanalı Yönet!')
                              .addOptions(
                                  { label: 'Kullanıcı Ekle', value: 'kullaniciekle'},
                                  { label: 'Kullanıcı Çıkar!', value: 'kullanicicikar'},
                                  { label: 'Oda Limiti Değiştir!', value: 'odalimit'},
                                  { label: 'Kanal Adını Değiştir!', value: 'kanaladi' },
                                  { label: 'Kanalı Kapat!', value: 'ozelodakapat'},
                              ),
                      );
                  text.send({
                      content: `
Merhaba <@${modal.member.id}>! Kanalını <#${voice.id}> yönetmek için aşağıdaki menüyü kullanabilirsin!
Odanda uzun bir süre aktiflik göstermezsen odan silinecektir.
Odana eklediğin tüm kullanıcılar odanı yönetebilir!
                  `, components: [row]
                  })

                  new PrivRoom({
                      userID: modal.member.id,
                      tChannelID: text.id,
                      vChannelID: voice.id,
                  }).save();
                  interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin kişisi kendisine **${firstResponse}** isimli odayı oluşturdu! (Ses Kanalı : <#${voice.id}> - Yönetim Paneli: <#${text.id}> - Kullanıcı Sayısı: ${secondResponse})` })
              }
          });
              }
              if (interaction.customId == "ozelodayonetim") {
                if (interaction.values[0] == "odalimit") {
                    let limiticinmodal = getRandomInt(1, 1000)
                    const newLimit = new Modal()
                        .setCustomId(`${interaction.member.id}ozelOda_Modal${limiticinmodal}`)
                        .setTitle('Yeni Oda Limiti;')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('ozelOda_newLimit')
                                .setLabel('Oda yeni limiti')
                                .setStyle('SHORT')
                                .setMinLength(1)
                                .setMaxLength(2)
                                .setPlaceholder('1 - 99 arası')
                                .setRequired(true)
                        );


                    showModal(newLimit, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}ozelOda_Modal${limiticinmodal}`) {
                            const newLimit = modal.getTextInputValue('ozelOda_newLimit')
                            let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });
                            let channel = {
                                v: modal.guild.channels.cache.get(privateVoiceData.vChannelID),
                                t: modal.guild.channels.cache.get(privateVoiceData.tChannelID)
                            }
                            await channel.v.edit({ userLimit: newLimit })
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! Kanalın için limiti ${newLimit} olarak ayarladım!` })
                            interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin <#${channel.v}> kanalının yeni limiti ${newLimit} olarak ayarlandı!` })
                        }
                    })
                }
                if (interaction.values[0] == "kullaniciekle") {
                    let usericinmodal = getRandomInt(1, 1000)
                    const newUser = new Modal()
                        .setCustomId(`${interaction.member.id}ozelOda_Modal${usericinmodal}`)
                        .setTitle('Odaya Eklenecek Kişi;')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('kullaniciID')
                                .setLabel('Kullanıcı IDsi')
                                .setStyle('SHORT')
                                .setMinLength(18)
                                .setMaxLength(18)
                                .setPlaceholder('Eklemek İstediğiniz Kullanıcı ID')
                                .setRequired(true)
                        );
                    showModal(newUser, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}ozelOda_Modal${usericinmodal}`) {
                            const kullanici = modal.getTextInputValue('kullaniciID')
                            let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });

                            let channel = {
                                v: modal.guild.channels.cache.get(privateVoiceData.vChannelID),
                                t: modal.guild.channels.cache.get(privateVoiceData.tChannelID)
                            }
                           await channel.v.permissionOverwrites.edit(kullanici, { ViewChannel: true, Connect: true  });
                           await channel.t.permissionOverwrites.edit(kullanici, { ViewChannel: true, SendMessages: true });
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! Kanalına <@${kullanici}> kişisini başarıyla ekledin!` })
                            interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin <#${channel.v}> kanalına <@${kullanici}> eklendi` })
                        }
                    })
                }
                if (interaction.values[0] == "kullanicicikar") {
                    let usericinmodal = getRandomInt(1, 1000)
                    const newUser = new Modal()
                        .setCustomId(`${interaction.member.id}ozelOda_Modal${usericinmodal}`)
                        .setTitle('Odadan Çıkarılıcak Kişi;')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('kullaniciID')
                                .setLabel('Kullanıcı IDsi')
                                .setStyle('SHORT')
                                .setMinLength(18)
                                .setMaxLength(18)
                                .setPlaceholder('Çıkarmak İstediğiniz Kullanıcı ID')
                                .setRequired(true)
                        );
                    showModal(newUser, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}ozelOda_Modal${usericinmodal}`) {
                            const kullanici = modal.getTextInputValue('kullaniciID')
                            let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });
                     
                            let channel = {
                                v: modal.guild.channels.cache.get(privateVoiceData.vChannelID),
                                t: modal.guild.channels.cache.get(privateVoiceData.tChannelID)
                            }
                           await channel.v.permissionOverwrites.edit(kullanici, { Connect: false  });
                           await channel.t.permissionOverwrites.edit(kullanici, { ViewChannel: false  });
                       
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! Kanalına <@${kullanici}> kişisini başarıyla çıkardın!` })
                            interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin <#${channel.v}> kanalından <@${kullanici}> çıkardı` })
                        }
                    })
                }
                if (interaction.values[0] == "kanaladi") {
                    let kanalicinmodal = getRandomInt(1, 1000)
                    const newUser = new Modal()
                        .setCustomId(`${interaction.member.id}ozelOda_Modal${kanalicinmodal}`)
                        .setTitle('Yeni Kanal İsmi;')
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId('yenikanal')
                                .setLabel('Yeni Kanal İsmi;')
                                .setStyle('SHORT')
                                .setMinLength(1)
                                .setMaxLength(18)
                                .setPlaceholder('Yeni Oda İsmi')
                                .setRequired(true)
                        );
                    showModal(newUser, {
                        client: client,
                        interaction: interaction
                    });

                    client.on("modalSubmit", async (modal) => {
                        if (modal.customId == `${interaction.member.id}ozelOda_Modal${kanalicinmodal}`) {
                            const newName = modal.getTextInputValue('yenikanal')
                            let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });
                            let channel = {
                                v: modal.guild.channels.cache.get(privateVoiceData.vChannelID),
                                t: modal.guild.channels.cache.get(privateVoiceData.tChannelID)
                            }
                            await channel.v.edit({ name: newName }).catch(() => { })
                            await channel.t.edit({ name: newName }).catch(() => { })
                            await modal.deferReply({ ephemeral: true })
                            modal.followUp({ content: `Merhaba! Kanalının yeni ismi \`${newName}\` olarak ayarlandı!` })
                            interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${modal.member.id}> kişisinin <#${channel.v}> kanalının ismi \`${newName}\` olarak değiştirildi!` })
                        }
                    })
                }
                if (interaction.values[0] == "ozelodakapat") {
                    let privateVoiceData = await PrivRoom.findOne({ userID: interaction.member.id });
                    let channel = { v: interaction.guild.channels.cache.get(privateVoiceData.vChannelID), t: interaction.guild.channels.cache.get(privateVoiceData.tChannelID) }
                    interaction.reply({ content: `Odanız **3** saniye içerisinde silinecektir.`, ephemeral: true }).then(() => {
                        setTimeout(async () => {
                            await PrivRoom.deleteOne({ userID: interaction.member.id });
                            await channel.v.delete().catch(() => { });
                            await channel.t.delete().catch(() => { });
                        }, 3000)
                    })
                    interaction.guild.channels.cache.find(x => x.name == "priv-log").send({ content: `<@${interaction.member.id}> kişisinin özel odası kapatıldı!` })
                }
            }

})
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
