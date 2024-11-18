const fs = require('fs');
const csv = require('csv-parser');
const Discord = require("discord.js");
require("dotenv").config()

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


//All Sub-Modules Imports Goes Here 
const addBanWordCommand = require('../src/commands/addbanWord.js');
const allowedSiteManager = require('../src/commands/addallowedsite.js')
const handlebuttons = require("./SubModules/Buttons.js")
const announcementHandler = require("./SubModules/announcementHandler.js");
const socialMediaNotifierHandler = require("./SubModules/socialMediaNotifierHandler.js")
const gamingModalSubmission = require('../Modules/GamingFormDelivery.js');
const subEventManager = require("../src/commands/create-sub-event.js");
const gmaingCategoryManager = require("../src/commands/create-gaming-category.js");
const help=require("../Modules/SubModules/help.js")
require("dotenv").config();


module.exports = async (interaction, client) => {

    //Add The Conditionals for Interaction Identifier Here and Send Flow to the Function Directly if no Race Condition Asynchronously if has a Race Condition
    // if (interaction.commandName==='createrole'){
    //     createrole(interaction)
    //     return;
    // }
    //Example Use
    try {
        if (interaction.customId === "GamingModal") {
            gamingModalSubmission(interaction);
            return;
        }



        // Handle Slash Commands
        if (interaction.isChatInputCommand()) {
            let commandHandled = false;

            switch (interaction.commandName) {
                case 'create-sub-event-channel':
                    await subEventManager.handelinteraction(interaction);
                    commandHandled = true;
                    break;
                    case 'help':
                        await help(interaction);
                        commandHandled = true;
                        break;

                case 'create-gaming-category':
                    await gmaingCategoryManager.handelinteraction(interaction, client);
                    commandHandled = true;
                    break;
                case "announce":
                    announcementHandler(interaction, client);
                case 'addbanword':
                    await addBanWordCommand.handelinteraction(interaction);
                    commandHandled = true;
                    break;

                case 'setalloweddomain':
                case 'removealloweddomain':
                case 'listalloweddomains':
                case 'requestdomain':
                case 'listdomainrequests':
                    await allowedSiteManager.handleInteraction(interaction);
                    commandHandled = true;
                    break;
            }

            // Only send unknown command message if command wasn't handled
            // if (!commandHandled && !interaction.replied && !interaction.deferred) {
            //     await interaction.reply({
            //         content: 'Unknown command.',
            //         ephemeral: true
            //     });
            // }
        }
    } catch (error) {
        console.error('Error in interaction handler:', error);
        try {
            const errorMessage = {
                content: 'There was an error processing your request.',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        } catch (e) {
            console.error('Error sending error message:', e);
        }
    }
};