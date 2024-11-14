const fs = require("fs");
const path = require("path");
const Discord = require("discord.js");
const eventNotifier = require("../Modules/SubModules/EventNotifier.js");
const eventdatafilepath = path.join(__dirname, "registeredevents.json");
const {
  Client,
  IntentsBitField,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");

// All Sub-Modules Imports Goes Here

require("dotenv").config();

module.exports = async (interaction, client) => {
  try {
    let scheduledEvents = [];
    const channelId = process.env.Sub_Event_Channel;

    try {
      // Load existing scheduled events from the file
      const data = fs.readFileSync(eventdatafilepath, "utf8");
      if (data) {
        const parsedData = JSON.parse(data);
        // If the data is an object, wrap it in an array
        if (Array.isArray(parsedData)) {
          scheduledEvents = parsedData;
        } else {
          scheduledEvents = [parsedData]; // Convert object to array
        }
      } else {
        scheduledEvents = []; // Default to an empty array if no data is found
      }
    } catch (error) {
      console.log("No existing events or failed to read file:", error);
      scheduledEvents = []; // Set to an empty array on error
      // Initialize the file with an empty array
      fs.writeFileSync(eventdatafilepath, JSON.stringify([], null, 2));
    }

    // Checks if the interaction is a command
    if (!interaction.isCommand()) return;

    // Checks for the required role
    const { commandName } = interaction;

    if (commandName === "registerevent") {
      // Collect event details from the slash command
      const eventId = interaction.options.getString("id");
      const eventName = interaction.options.getString("event_name");
      const eventLocation = interaction.options.getString("event_location");
      const eventDate = interaction.options.getString("event_date");
      const eventTime = interaction.options.getString("event_time");

      // Check if the event ID is already in use
      const idExists = scheduledEvents.some((event) => event.id === eventId);
      if (idExists) {
        return interaction.reply({
          content: `The ID **${eventId}** is already in use with the EVENT **${eventName}**.\n Please choose a different ID.`,
          ephemeral: true,
        });
      }

      // Schedule the event reminder
      const is_registered = eventNotifier.scheduleEventReminder(
        client,
        channelId,
        eventName,
        eventLocation,
        eventDate,
        eventTime,
        interaction,
        eventId
      );

      // Store the event details in the scheduledEvents array
      if (is_registered) {
        const event = {
          id: eventId,
          eventName,
          eventLocation,
          eventDate,
          eventTime,
        };

        // Add event to the scheduled events array
        scheduledEvents.push(event);

        // Write the updated array back to the file
        fs.writeFileSync(eventdatafilepath, JSON.stringify(scheduledEvents, null, 2));
      }
    }

    // Remove Event Code
    if (commandName === "removeevent") {
      const eventId = interaction.options.getString("id");

      // Find the event by ID
      const eventIndex = scheduledEvents.findIndex(
        (event) => event.id === eventId
      );

      if (eventIndex === -1) {
        return interaction.reply({
          content: `No event found with ID **${eventId}**.`,
          ephemeral: true,
        });
      }

      // Remove event from scheduledEvents
      const removedEvent = scheduledEvents.splice(eventIndex, 1)[0];

      // Cancel the scheduled jobs for this event ID
      const isCanceled = eventNotifier.cancelEvent(eventId);

      if (isCanceled) {
        await interaction.reply({
          content: `Event with ID **${eventId}** and Event name **${removedEvent.eventName}** has been removed, and the notification has been canceled.`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `Event with ID **${eventId}** has been removed`,
          ephemeral: true,
        });
      }

      // Update the file after removal
      fs.writeFileSync(eventdatafilepath, JSON.stringify(scheduledEvents, null, 2));
    }

    // Displaying registered events
    if (commandName === "showevents") {
      console.log(scheduledEvents);
      if (scheduledEvents.length === 0) {
        return interaction.reply({
          content: "No events are currently registered.",
          ephemeral: true,
        });
      }

      // Create the embed message for the event list
      const eventEmbed = new EmbedBuilder()
        .setColor("#A0522D") // Use a cool color scheme
        .setTitle("📅 Upcoming Events")
        .setDescription(
          "Here’s a list of all upcoming events that are registered:"
        )
        .setTimestamp();

      // Add each event as a field
      scheduledEvents.forEach((event, index) => {
        eventEmbed.addFields({
          name: `🎉 **${index + 1}. ${event.eventName}**`,
          value: `**📍 Location:** ${event.eventLocation}\n**📅 Date:** ${event.eventDate}\n**🕒 Time:** ${event.eventTime}\n**🆔 ID:** ${event.id}\n━━━━━━━━━━━━━━━━━━━`,
        });
      });

      await interaction.reply({ embeds: [eventEmbed], ephemeral: true });
    }
  } catch (error) {
    console.log(error);
  }
};
