var cron = require('node-cron');
import sentOSNotification from "../../../handler/handleOSPushNotificaiton";

let job1 = cron.schedule('0 0 6 * * *', () => {
  sentOSNotification(0)
});

let job2 = cron.schedule('0 30 6 * * *', () => {
  sentOSNotification(1)
});

let job3 = cron.schedule('0 0 9 * * *', () => {
  sentOSNotification(2)
});

let job4 = cron.schedule('0 0 12 * * *', () => {
  sentOSNotification(3)
});

let job5 = cron.schedule('0 0 17 * * *', () => {
  sentOSNotification(4)
});

let job6 = cron.schedule('0 0 21 * * *', () => {
  sentOSNotification(5)
});

export default function handler(req, res) {
  let { command } = req?.query || {};
  let date = new Date();

  if(command==='start'){
    job1.start()
    job2.start()
    job3.start()
    job4.start()
    job5.start()
    job6.start()
  }
  if(command==='stop'){
    job1.stop()
    job2.stop()
    job3.stop()
    job4.stop()
    job5.stop()
    job6.stop()
  }
  
  res.status(200).json({ name: 'success', date: date.toLocaleString() })
}




