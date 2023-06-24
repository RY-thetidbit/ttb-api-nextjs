const { info } = require('console');
const fs = require('fs')
var axios = require("axios").default;
var admin = require("firebase-admin");
var serviceAccount = require("../../../firebase-admin//thetidbit-project-firebase-adminsdk-t92yf-fbe09796e3.json");

console.log("admin**********************", admin.apps.length)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Handler for the /api/news route
export default async function handler(req, res) {
  await _sendWPToAndroid();
  return res.send("notisend")
}
const _sendWPToAndroid = async (notification) => {

  let payload = {
    data: { newsInxShow: "true", newsInx: "hello" },
    notification: {
      // title: "Meet Trupti Toradmal - Actress Who Played Vibhishana’s Glamorous Wife In AdipurushMeet Trupti Toradmal - Actress Who Played Vibhishana’s Glamorous Wife In Adipurush", 
      body: "Meet Trupti Toradmal - Actress Who Played Vibhishana’s Glamorous Wife In AdipurushMeet Trupti Toradmal - Actress Who Played Vibhishana’s Glamorous Wife In Adipurush",
      // image:"https://images.news18.com/ibnlive/uploads/2023/06/trupti-toradmal-16874394423x2.jpg"
    }
  };

  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  let response;
  try {
    // console.log("@@@@@@@@@@@@@",registeredTokens,payload)
    response = admin.messaging().sendToDevice(["dsSsA7ktThGZV0oJwtSySQ:APA91bFf85_I7VEWsL1Pfv4ZHnb8xy9cx9FUb_fjb9uUiofOhln-e9gMG8DbU64b2cK7HrtVI5pZ53Y1SYIhXHJTv-y-fENVAUqkFoMySR6Ik2kKXRRaCcrwRqMxp4LejmIqRae2WQBg"],
      payload, options)
    console.log("Successfully sent message:", response);
  } catch (firebaseErr) {
    console.log("check errror blog:", firebaseErr)
  }
}