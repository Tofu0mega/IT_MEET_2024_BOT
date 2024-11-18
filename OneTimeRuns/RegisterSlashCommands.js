require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');


//The Below Snippets Shows How to Create a Slash Command( generally for Moderator and Higher Level Use (Make the Command Name and Conditions Discriptive ))

//  Registering SLash Command to have Banned word
const commands = [
  {
    name: 'help',
    description: '/help provides the list of all commands and their functions'
  },
  {
    name: 'announce',
    description: '/annouce announces on a channel!',
    options: [
      {
        name: 'message',
        description: 'Message for the annoucement!(Make sure to use | for line breaks)',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ]
  },
  {
    name: 'registerevent',
    description: 'Input the detail of the event',
    options: [
      {
        name: 'id',
        description: 'sets the event id',
        type: ApplicationCommandOptionType.String,
        required: true,

      },
      {
        name: 'event_name',
        description: 'Name of the event to add',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'event_location',
        description: 'Location of the Event',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'event_date',
        description: 'Date of the event (YYYY-MM-DD)',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'event_time',
        description: 'Time of the event (HH:mm) eg: 11:00, 23:00',
        type: ApplicationCommandOptionType.String,
        required: true,
      },

    ],
  },
  {
    name: 'removeevent',
    description: 'removes the scheduled event',
    options: [
      {
        name: 'id',
        description: 'removes the scheduled event id',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  {
    name: 'showevents',
    description: 'Displays all the registered events',
  },

  {
    name: 'addbanword',
    description: 'Add banned word that cannot be used in the server(Moderator Permission Only',
    options: [
      {
        name: "word",
        type: ApplicationCommandOptionType.String,
        description: "The Word to Ban",
        required: true,
      },
    ],
  },

  {
    name: 'setalloweddomain',
    description: 'Add a domain to the allowed list (Moderator Only)',
    options: [
      {
        name: "domain",
        type: ApplicationCommandOptionType.String,
        description: "The domain to allow (e.g., youtube.com)",
        required: true,
      },
    ],
  },
  {
    name: 'removealloweddomain',
    description: 'Remove a domain from the allowed list (Moderator Only)',
    options: [
      {
        name: "domain",
        type: ApplicationCommandOptionType.String,
        description: "The domain to remove from allowed list",
        required: true,
      },
    ],
  },
  {
    name: 'requestdomain',
    description: 'Request a new domain to be added to the allowed list',
    options: [
      {
        name: "domain",
        type: ApplicationCommandOptionType.String,
        description: "The domain you want to request permission for",
        required: true,
      },
    ],
  },
  {
    name: 'listalloweddomains',
    description: 'Show all currently allowed domains',
  },
  {
    name: 'listdomainrequests',
    description: 'Show all pending domain requests (Moderator Only)',
  },
  {
    name: "create-sub-event-channel",
    description: "Creates a category and text channel within it",
    options: [
      {
        type: 3, //string type
        name: 'category-name',
        description: 'The name of the text channel category',
        required: true,
      },
    ],
  },

  {
    name: "create-gaming-category",
    description: "Creates a category and voice channel within it",
    options: [
      {
        type: 3,
        name: 'game-category-name',
        description: 'The name of the game',
        required: true,
      }
    ]
  },

  //   {
  //     name: 'createrole',
  //     description: 'create a new role along with the needed channel(Admin Level Only)',
  //     options:[
  //       {
  //         name:'role_name',
  //         description:'name of the role',
  //         type: ApplicationCommandOptionType.String,
  //         required: true,
  //       },
  //       {
  //         name: 'role_emoji',
  //         description: 'emoji for the role',
  //         type: ApplicationCommandOptionType.String,
  //         required: true,
  //       },


  //     ]
  //   },
  //   {
  //     name: 'createproject',
  //     description: 'create a new role project with the needed channel(Admin Level Only)',
  //     options:[
  //       {
  //         name:'project_name',
  //         description:'name of the project',
  //         type: ApplicationCommandOptionType.String,
  //         required: true,
  //       },
  //       {
  //         name: 'project_emoji',
  //         description: 'emoji for the project',
  //         type: ApplicationCommandOptionType.String,
  //         required: true,
  //       },


  //     ]
  //   },
  //   {
  //     name: 'deletechannel',
  //     description: 'create a new role project with the needed channel(Admin Level Only)',

  //   },






];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();