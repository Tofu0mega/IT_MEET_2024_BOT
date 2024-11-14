module.exports = async (interaction,client) =>
    {
    const message =await interaction.options.get('message');
    const formattedMessage = message.value.replace(/\|/g, '\n');
  
    await client.channels.cache.get(process.env.ANNOUNCEMENT_CHANNEL_ID)
        .send(
          {content:`${formattedMessage}`}
        );
    await interaction.reply(
      {content:"The announcement has been made!",
      ephemeral:true}
    );
  }