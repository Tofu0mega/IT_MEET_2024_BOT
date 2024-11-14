module.exports  = async ()=>
    {
    const url = "https://graph.facebook.com/v21.0/me/";
  
  const params = new URLSearchParams({
    fields: "posts.limit(1){full_picture,permalink_url,message}",
    access_token: process.env.GRAPH_API_TOKEN,
  });
  
  const post_details = {
    postID:null,
    postURL:null,
    postIMG:null,
    postMessage:null
  }
  
  const response = await fetch(`${url}?${params.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((value) => {
      if (value.posts && value.posts.data) {
        value.posts.data.forEach((post) => {
          post_details.postID = post.id
          post_details.postURL = post.permalink_url.toString()
          post_details.postIMG = post.full_picture
          post_details.postMessage = post.message
        });
      } else {
        console.log("No posts found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
    // console.log(post_details)
    return post_details
  }