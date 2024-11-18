const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
  } = require("discord.js");



module.exports = async (interaction,client) =>


    {
        const helpEmbed = new EmbedBuilder()
        .setColor(0x00FF7F) // Light green color
        .setTitle('📚 Help Menu')
        .setDescription('Here are the available commands you can use:')
        .addFields(
          { name: '/help', value: 'Provides a list of all commands and their functions.' },
          { name: '/announce [message]', value: 'Announces a message in a channel. Use `|` for line breaks.' },
          {
            name: '/registerevent [id] [event_name] [event_location] [event_date] [event_time]',
            value: 'Registers a new event with the specified details (date format: YYYY-MM-DD, time format: HH:mm).',
          },
          { name: '/removeevent [id]', value: 'Removes a scheduled event by its ID.' },
          { name: '/showevents', value: 'Displays all registered events.' },
          { name: '/addbanword [word]', value: 'Adds a banned word to the server (Moderator only).' },
          { name: '/setalloweddomain [domain]', value: 'Adds a domain to the allowed list (Moderator only).' },
          { name: '/removealloweddomain [domain]', value: 'Removes a domain from the allowed list (Moderator only).' },
          { name: '/requestdomain [domain]', value: 'Requests a domain to be added to the allowed list.' },
          { name: '/listalloweddomains', value: 'Displays all allowed domains.' },
          { name: '/listdomainrequests', value: 'Displays all pending domain requests (Moderator only).' },
          {
            name: '/create-sub-event-channel [category-name]',
            value: 'Creates a category and a text channel within it.',
          },
          {
            name: '/create-gaming-category [game-category-name]',
            value: 'Creates a category and a voice channel within it.',
          }
        )
        .setFooter({ text: 'Use these commands wisely! For more details, contact a moderator.' })
        .setTimestamp();
  
      // Send the embed
      await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
  }