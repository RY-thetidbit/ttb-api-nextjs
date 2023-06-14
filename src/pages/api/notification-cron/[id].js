var cron = require('node-cron');
import sentOSNotification from "../../../../handler/handleOSPushNotificaiton";

export default function handler(req, res) {
  
  let { id=0 } = req?.query || {};
  id = isNaN(parseInt(id))?0:parseInt(id)

  let date = new Date();

  sentOSNotification(id);

  return res.status(200).json({ name: 'success', data: id, date });
}




