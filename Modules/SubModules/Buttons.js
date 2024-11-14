const Discord = require("discord.js");
const {
    Client,
    IntentsBitField,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
  } = require("discord.js");
  const gamingModal = require('../GamingFormModal.js');
module.exports = async (interaction) => {
    const MEMBER_ROLE_ID = process.env.COCRole; // Replace with your role ID

    if (interaction.customId === "gaming-form") {
        await gamingModal(interaction);
        return
      }
    switch (interaction.customId) {
        case 'accept_coc': {
            try {
                // Get the role
                const memberRole = interaction.guild.roles.cache.get(MEMBER_ROLE_ID);
                
                if (!memberRole) {
                    console.error('Member role not found');
                    await interaction.reply({
                        content: 'There was an error assigning your role. Please contact an administrator.',
                        ephemeral: true
                    });
                    return;
                }

                // Check if user already has the role
                if (interaction.member.roles.cache.has(MEMBER_ROLE_ID)) {
                    await interaction.reply({
                        content: 'You have already accepted the Code of Conduct.',
                        ephemeral: true
                    });
                    return;
                }

                // Add the role
                await interaction.member.roles.add(memberRole);

                // Reply with success message
                await interaction.reply({
                    content: 'Thank you for accepting the Code of Conduct! Welcome to IT Meet 2024.\nYou have been given the Techie role.',
                    ephemeral: true
                });

                // Log the role assignment
                console.log(`Assigned member role to ${interaction.user.tag}`);
            } catch (error) {
                console.error('Error handling CoC acceptance:', error);
                if (!interaction.replied) {
                    await interaction.reply({
                        content: 'There was an error processing your request. Please contact an administrator.',
                        ephemeral: true
                    });
                }
            }
            return;
        }
        // Add other button handlers here if needed
    }
    


}