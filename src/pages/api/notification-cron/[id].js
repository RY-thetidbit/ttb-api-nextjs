
import sentOSNotification from "../../../../handler/handleOSPushNotificaiton";

export default async function handler(req, res) {
  
  let { id=0 } = req?.query || {};

  id = isNaN(parseInt(id))?0:parseInt(id);

  console.log("reached :")
   await sentOSNotification(id);
   console.log("reached : send")

  res.status(200).json({ success: true });
}