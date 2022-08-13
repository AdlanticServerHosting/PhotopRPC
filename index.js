const client = require('discord-rich-presence')('1005652534075076661');
const axios = require('axios');

const apiurl = "https://photop.exotek.co/"
const userid = "" // Put your userid in here

function update() {
    axios
  .get(apiurl + "user?id=" + userid)
  .then(res => {
    function status() {
        if (res.data.Status == 1) {return "online"} else if (res.data.Status == 2) {return "group"} else {return "offline"}
    }
    const followers = res.data.ProfileData.Followers
    const following = res.data.ProfileData.Following

    console.log(res.data)
    client.updatePresence({
        state:  followers + " followers | " + following + " following",
        details: res.data.User,
        startTimestamp: Date.now(),
        largeImageKey: 'photop',
        smallImageKey: status(),
        instance: true,
    })
  })
  .catch(error => { console.error("An error occured! The person cannot be found or the user's profile has been set to private."); throw error; });
}

const currentfollowers = axios
    .get(apiurl + "user?id=" + userid)
    .then(res => {
        return res.data.ProfileData.Followers
    })
    .catch(error => { console.error("An error occured! The person cannot be found or the user's profile has been set to private."); throw error; })

function followercheck() {
    const f = axios.get(apiurl + "user?id=" + userid).then(res => {return res.data.ProfileData.Followers})
    if (f < currentfollowers) {
        console.log(`You have lost ${currentfollowers - f} since you started.`)
    } else if (f > currentfollowers) {
        console.log(`You have gained ${f - currentfollowers} since you started!`)
    } else {
        console.log("The has been no change ever since you ran.")
    }
}

client.on('connected', () => {console.log("Photop RPC x Discord"); console.log("Connected to Discord and Photop!"); update(); followercheck(); setInterval(function () {update(); followercheck()}, 180000);})
