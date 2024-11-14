const { AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { request } = require("undici");
require("dotenv").config();



module.exports = (client) => {

  client.on("guildMemberAdd", async (member) => {
    
    const WELCOME_CHANNEL_ID = process.env.WelcomeChannel;
    const COC_CHANNEL_ID = process.env.COCChannel;
    

    try {
      const welcomeChannel = client.channels.cache.get(WELCOME_CHANNEL_ID);
      
      if (!welcomeChannel) {
        console.error(`Welcome channel with ID ${WELCOME_CHANNEL_ID} not found`);
        return;
      }

      // Create canvas
      const canvas = Canvas.createCanvas(1100, 500);
      const context = canvas.getContext("2d");

      // Background
      const background = await Canvas.loadImage("https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D");
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Gradient overlay
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "rgba(0,0,0,0.8)");
      gradient.addColorStop(1, "rgba(0,0,0,0.2)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Welcome text
      context.font = "bold 60px Sans-serif";
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.fillText("Welcome to IT Meet 2024!", canvas.width / 2, 100);

      // Member name
      context.font = "bold 40px Sans-serif";
      context.fillStyle = "#ffff00";
      context.fillText(member.user.tag, canvas.width / 2, 170);

      // Avatar
      const avatarSize = 200;
      context.beginPath();
      context.arc(canvas.width / 2, 300, avatarSize / 2, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();
      const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: "jpg", size: 512 }));
      context.drawImage(avatar, canvas.width / 2 - avatarSize / 2, 300 - avatarSize / 2, avatarSize, avatarSize);

      // Create attachment
      const attachment = new AttachmentBuilder(await canvas.encode("png"), { name: "welcome-image.png" });

      // Create embed
      const embed = new EmbedBuilder()
        .setColor("#FF6B6B")
        .setTitle("🎉 Welcome to IT Meet 2024! 🎉")
        .setDescription(`We're thrilled to have you here, ${member}! Get ready for an amazing journey of innovation and technology.`)
        .addFields(
          { name: "🗓️ Event Date", value: "March 15-17, 2024", inline: true },
          { name: "📍 Location", value: "Kathmandu University", inline: true },
          { name: "\u200B", value: "\u200B" },
          { name: "🚀 Next Steps", value: `
            1️⃣ Read our Code of Conduct in <#${COC_CHANNEL_ID}>
            2️⃣ Introduce yourself in #introductions
            3️⃣ Join event channels that interest you
            4️⃣ Get ready to innovate and collaborate!
          `}
        )
        .setImage("attachment://welcome-image.png")
        .setFooter({ text: "IT Meet 2024 - Innovate • Connect • Transform", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      // Create buttons
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setURL("https://itmeet.kucc.ku.edu.np/")
            .setLabel("Official Website")
            .setStyle(ButtonStyle.Link)
        );

      // Send welcome message
      await welcomeChannel.send({ 
        content: `Welcome aboard, ${member}! 🚀`,
        files: [attachment],
        embeds: [embed],
        components: [row]
      });

      // Send DM
      const dmEmbed = new EmbedBuilder()
        .setColor("#4CAF50")
        .setTitle("Welcome to IT Meet 2024!")
        .setDescription(`
          Hello ${member.user.username}!
          
          We're excited to have you join us for IT Meet 2024. Here are some quick tips to get you started:
          
          • Check out the #welcome channel for important information
          • Read our Code of Conduct to ensure a great experience for everyone
          • Don't hesitate to ask questions in #help-desk
          
          We can't wait to see what you'll create and discover during the event!
        `)
        .setFooter({ text: "IT Meet 2024 Team" });

      await member.send({ embeds: [dmEmbed] }).catch(err => console.error("Error sending DM:", err));

      console.log(`Welcome message sent successfully for ${member.user.tag}`);
    } catch (error) {
      console.error('Error in welcome process:', error);
    }
  });
};