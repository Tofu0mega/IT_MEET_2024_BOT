const fetchFacebookData = require('./../Utils/fetchFacebookData.js');
const prevpoststore = "./prevpoststore.json"
const fs = require('fs');
function saveValueToJSON(value,path) {
  const data = { value }; // Wrap the value in an object with a "value" key
  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8'); // Write the value to the file
}

// Function to load the current value from the JSON file (returns null if file doesn't exist)
function loadValueFromJSON(path) {
  if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, 'utf-8'); // Read the file if it exists
      return JSON.parse(data).value;
  }
  return null; // Return null if file doesn't exist
}

module.exports = (client,EmbedBuilder) => {
  setInterval(async () => {
    let prevPostID=loadValueFromJSON(prevpoststore)
    
  let post_details = {
    postID:null,
    postURL:null,
    postIMG:null,
    postMessage:null
  }

  post_details = await fetchFacebookData()

  if(post_details.postID != prevPostID || prevPostID==null){
    const embed = new EmbedBuilder()
        .setTitle("New From Our FaceBook Page")
        .setDescription(post_details.postMessage)
        .setURL(post_details.postURL)
        .setImage(post_details.postIMG)
        .setTimestamp();
      
      const channel = client.channels.cache.get(process.env.SOCIAL_MEDIA_CHANNEL_ID)
      
    if (channel || newPost){
         await channel.send({embeds:[embed]});
      // console.log("There's a new post!");
      }
    const newdata = post_details.postID
    saveValueToJSON(newdata,prevpoststore)
    

    }
  }, 3000)
}