const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "Kullanıcı Bilgi",
    type: 2,
    run: async (client, interaction, config) => {

        const user = interaction.guild.members.cache.get(interaction.targetId);
        const joinedAgoCalculator = {
            fetch: {
                user(userInput, type) {
                    if (!userInput) throw new ReferenceError('Kullanıcıya hesaplama yapmasını sağlamadınız.');

                    if (type === "discord") {
                
                        const joinedDiscordTimestampInString = moment(userInput.user.createdAt).fromNow();

                        return joinedDiscordTimestampInString.toString(); 
                    } else if (type === "server") {
                    
                        const joinedServerTimestampInString = moment(userInput.joinedAt).fromNow();

                        return joinedServerTimestampInString.toString(); 
                    } else throw new ReferenceError('Geçersiz tür. Yalnızca "uyumsuzluk" veya "sunucu" kullanın.');
                }
            }
        };


        const bot = {
            true: "Evet",
            false: "Hayır"
        };

       
        const acknowledgements = {
            fetch: {
                user(userInput) {
                    let result;

                    try {
                        if (userInput.permissions.has(PermissionsBitField.ViewChannel)) result = "Sunucu Üyesi";
                        if (userInput.permissions.has(PermissionsBitField.KickMembers)) result = "Sunucu Moderatörü";
                        if (userInput.permissions.has(PermissionsBitField.ManageServer)) result = "Sunucu Yöneticisi";
                        if (userInput.permissions.has(PermissionsBitField.Administrator)) result = "Sunucu Yöneticisi";
                        if (userInput.id === interaction.guild.ownerId) result = "Sunucu Sahibi";

                    } catch (e) {
                        result = "Sunucu Üyesi";
                    };

                    return result;
                }
            }
        };


        return interaction.reply(
            {
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${user.user.tag}'Bilgi:`)
                        .setThumbnail(user.displayAvatarURL(
                            {
                                dynamic: true
                            }
                        ))
                        .addFields(
                            {
                                name: "İsim",
                                value: `${user.user.tag}`,
                                inline: true
                            },
                            {
                                name: "İd",
                                value: `\`${user.id}\``,
                                inline: true
                            },
                            {
                                name: `Roller [${user.roles.cache.size - 1}]`,
                                value: `${user.roles.cache.map((ROLE) => ROLE).join(' ').replace('@everyone', '') || "[Rol Yok]"}`,
                                inline: true
                            },
                            {
                                name: "Sunucuya Katılma",
                                value: `${new Date(user.joinedTimestamp).toLocaleString()}\n(${joinedAgoCalculator.fetch.user(user, "server")})`,
                                inline: true
                            },
                            {
                                name: "Discorda Katılma",
                                value: `${new Date(user.user.createdTimestamp).toLocaleString()}\n(${joinedAgoCalculator.fetch.user(user, "discord")})`,
                                inline: true
                            },
                            {
                                name: "Bot mu?",
                                value: `${bot[user.user.bot]}`,
                                inline: true
                            },
                            {
                                name: "Kimlik",
                                value: `${acknowledgements.fetch.user(user)}`
                            }
                        )
                        .setColor('Blue')
                ],
                ephemeral: true
            }
        );

    },
};
