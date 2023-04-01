const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config");
const serverData = require(`../../Schemas/Guild`)

module.exports = {
  name: "messageCreate"
};

client.on('messageCreate', async (message) => {
  let Data = await serverData.findOne({guildID: config.Guild.ID })
  if (message.channel.type !== 0) return;
  if (message.author.bot) return;
  
  const prefix = (config.Prefix)

  if ([".url", "!url", "!link",".link","url","link"].includes(message.content.toLowerCase())) return message.channel.send({ content: `${Data?.guildUrl}` });

  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  let command = client.prefix_commands.get(cmd);

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`Ne yazık ki, bu komutu kullanma yetkiniz yok.`)
            .setColor("Red")
        ]
      })
    };

    if (command.owner, command.owner == true) {
      if (config.Users?.OWNERS) {
        const allowedUsers = []; // New Array.

        config.Users.OWNERS.forEach(user => {
         const fetchedUser = message.guild.members.cache.get(user);
          if (!fetchedUser) return allowedUsers.push('*Unknown*');
          allowedUsers.push(`${fetchedUser.user.tag}`);
        })

        if (!config.Users.OWNERS.some(ID => message.member.id.includes(ID))) return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`🚫 Üzgünüm ama sadece sahipler bu komutu kullanabilir! İzin verilen kullanıcılar:\n**${allowedUsers.join(", ")}**`)
              .setColor("Red")
          ]
        })
      }
    };

    try {
      command.run(client, message, args, prefix, config);
    } catch (error) {
      console.error(error);
    };
  }
});
