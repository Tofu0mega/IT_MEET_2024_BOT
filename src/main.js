require("dotenv").config();
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

// Import all handlers and modules
const interactionsHandler = require("../Modules/Interactionhandler.js");
const registerCommands = require("../OneTimeRuns/RegisterSlashCommands.js");
const setupCodeOfConduct = require("../OneTimeRuns/CodeofConductMessage.js");
const welcome = require("../Modules/Welcome.js");
const addBanWords = require("./commands/addbanWord.js");
const siteManagement = require("./commands/addallowedsite.js")
const fetchFacebokData = require("../Modules/Utils/fetchFacebookData.js")
const socialMediaNotifierHandler = require('../Modules/SubModules/socialMediaNotifierHandler.js')

const gamingModalSubmission = require('../Modules/GamingFormDelivery.js');

const handlebuttons=require("../Modules/SubModules/Buttons.js")

const notifhandler=require("../Modules/Notifhandler.js")

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
  ],
});



// Make the ready event handler async
client.once("ready", async () => {
  console.log(`✅ ${client.user.tag} is online.`);
  socialMediaNotifierHandler(client,EmbedBuilder);
  // Set up Code of Conduct
  try {
    await setupCodeOfConduct(client);
    console.log('Code of Conduct setup completed');
  } catch (error) {
    console.error('Error setting up Code of Conduct:', error);
  }
  welcome(client);
});

// Handle interactions
client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton()) {
      handlebuttons(interaction)
      return;

  }
    const ALLOWED_ROLE_ID = [process.env.MODROLE,process.env.EVENT_LEAD];
    // Replace with the ID of the channel where reminders should be sent
    const hasRole = [interaction.member.roles.cache.has(ALLOWED_ROLE_ID[0]),interaction.member.roles.cache.has(ALLOWED_ROLE_ID[1])];
    if (!hasRole[0] && !hasRole[1]) {
      return interaction.reply({
        content: "You don't have permission use these slash commands.",
        ephemeral: true,
      });
    }
    
    await notifhandler(interaction,client)
    await interactionsHandler(interaction,client);
  } catch (error) {
    console.error('Error in Interaction handeler',error);
  }
});

// Handle messages
client.on('messageCreate', async (message) => {
  try {
    await addBanWords.handleMessage(message);
    await siteManagement.handleMessage(message);
  } catch (error) {
    console.error('Error in message handler:', error);
  }
});

// Login the bot
client.login(process.env.TOKEN);