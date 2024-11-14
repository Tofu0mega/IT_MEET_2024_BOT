require("dotenv").config();
const { PermissionsBitField } = require('discord.js');
const { sendTeamButtons } = require('../../OneTimeRuns/FillGameFormGenerator');

const handelinteraction = async (interaction, client) => {
  try {
    const ALLOWED_ROLE_ID = [process.env.MODROLE, process.env.EVENT_LEAD];
    // Replace with the ID of the channel where reminders should be sent
    const hasRole = [interaction.member.roles.cache.has(ALLOWED_ROLE_ID[0]), interaction.member.roles.cache.has(ALLOWED_ROLE_ID[1])];
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'create-gaming-category') {

      const categoryName = interaction.options.getString('game-category-name');
      await interaction.deferReply({ ephemeral: true});


      if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return interaction.editReply('I need permission to manage channels to use this command.');
      }

     
      if (!hasRole[0] && !hasRole[1]) {
        return interaction.editReply('Specified role not found.');
      }

      try {
        const category = await interaction.guild.channels.create({
          name: categoryName,
          type: 4,
          // permissionOverwrites: [
          //   {
          //     id: interaction.guild.roles.everyone.id,
          //     deny: [PermissionsBitField.Flags.ViewChannel],
          //   },
          //   {
          //     id: role.id,
          //     allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
          //   }
          // ]
        });

        const voiceChannels = [];

        for (let i = 1; i <= 8; i++) {
          const channel = await interaction.guild.channels.create({
            name: `Team ${i}`,
            type: 2,
            parent: category.id,
            // permissionOverwrites: [
            //   {
            //     id: interaction.guild.roles.everyone.id,
            //     deny: [PermissionsBitField.Flags.ViewChannel],
            //   },
            //   {
            //     id: role.id,
            //     allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            //   }
            // ]
          });

          voiceChannels.push(channel.name);
        }


        const teamFormFillUp = await interaction.guild.channels.create({
          name: "Team Form Fill Up",
          type: 0,
          parent: category.id,
          // permissionOverwrites: [
          //   {
          //     id: interaction.guild.roles.everyone.id,
          //     deny: [PermissionsBitField.Flags.ViewChannel],
          //   },
          //   {
          //     id: role.id,
          //     allow: [
          //       PermissionsBitField.Flags.ViewChannel,
          //       PermissionsBitField.Flags.SendMessages
          //     ],
          //   }
          // ]
        });

        await sendTeamButtons(client, teamFormFillUp.id);

        await interaction.editReply(
          `Category **${category.name}** containing voice channels **${voiceChannels.join(", ")}** and **${teamFormFillUp.name}** created successfully!`,{ ephemeral: true}
        );
      } catch (error) {
        console.error(error);
        await interaction.editReply('There was an error creating the category and channels.');
      }
    }
  } catch (error) {
    console.error('Error in create-gaming-category command:', error);
    if (!interaction.replied) {
      await interaction.reply({
        content: 'There was an error processing your request.',
        ephemeral: true
      });
    }
  }
};

module.exports = {
  handelinteraction
};