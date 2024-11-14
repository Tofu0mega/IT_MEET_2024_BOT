require("dotenv").config();

const { PermissionsBitField } = require('discord.js');


const handelinteraction = async (interaction) => {
    try {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName === 'create-sub-event-channel') {
            const ALLOWED_ROLE_ID = [process.env.MODROLE, process.env.EVENT_LEAD];
            // Replace with the ID of the channel where reminders should be sent
            const hasRole = [interaction.member.roles.cache.has(ALLOWED_ROLE_ID[0]), interaction.member.roles.cache.has(ALLOWED_ROLE_ID[1])];
            const categoryName = interaction.options.getString('category-name');
            await interaction.deferReply({ ephemeral: true});


            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.editReply('You need permission to manage channels to use this command.');
            }


           
            if (!hasRole[0] && !hasRole[1]) {
                return interaction.editReply('Specified role not found.');
            }

            try {

                const category = await interaction.guild.channels.create({
                    name: categoryName,
                    type: 4,
                    // permissionOverwrites: [
                    //     {
                    //         id: interaction.guild.roles.everyone.id,
                    //         deny: [PermissionsBitField.Flags.ViewChannel],
                    //     },
                    //     {
                    //         id: role.id,
                    //         allow: [
                    //             PermissionsBitField.Flags.ViewChannel,
                    //             PermissionsBitField.Flags.SendMessages
                    //         ],
                    //     }
                    // ]
                });


                const channel1 = await interaction.guild.channels.create({
                    name: "Test",
                    type: 0,
                    parent: category.id,
                    // permissionOverwrites: [
                    //     {
                    //         id: interaction.guild.roles.everyone.id,
                    //         deny: [PermissionsBitField.Flags.ViewChannel],
                    //     },
                    //     {
                    //         id: role.id,
                    //         allow: [
                    //             PermissionsBitField.Flags.ViewChannel,
                    //             PermissionsBitField.Flags.SendMessages
                    //         ],
                    //     }
                    // ]
                });

                await interaction.editReply(
                    `Category **${category.name}** and channel **${channel1.name}** created successfully!`
                );


                const channel2 = await interaction.guild.channels.create({
                    name: "General",
                    type: 0,
                    parent: category.id,
                    // permissionOverwrites: [
                    //     {
                    //         id: interaction.guild.roles.everyone.id,
                    //         deny: [PermissionsBitField.Flags.ViewChannel],
                    //     },
                    //     {
                    //         id: role.id,
                    //         allow: [
                    //             PermissionsBitField.Flags.ViewChannel,
                    //             PermissionsBitField.Flags.SendMessages
                    //         ],
                    //     }
                    // ]
                });

                await interaction.editReply(
                    `Category **${category.name}** and channels **${channel1.name}**, **${channel2.name}** created successfully!`,{ ephemeral: true}
                );
            } catch (error) {
                console.error(error);
                await interaction.editReply('There was an error creating the category and channels.');
            }
        }
    } catch (error) {
        console.error('Error in create-sub-event-channel command:', error);
        if (!interaction.replied) {
            await interaction.reply({
                content: 'There was an error processing your request.',
                ephemeral: true
            });
        }
    }
}


module.exports = {
    handelinteraction
}