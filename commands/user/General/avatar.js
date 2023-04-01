const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "Avatar",
    type: 2,
    run: async (client, interaction, config) => {

        const user = interaction.guild.members.cache.get(interaction.targetId);


        return interaction.reply(
            {
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${user.user.tag}`)
                        .setImage(user.displayAvatarURL(
                            {
                                dynamic: true
                            }
                        ))
                ],
                ephemeral: true
            }
        );

    },
};
