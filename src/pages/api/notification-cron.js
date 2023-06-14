var cron = require('node-cron');
import sentOSNotification from "../../../handler/handleOSPushNotificaiton";

let job1 = cron.schedule('50 30 0 * * *', () => {
  sentOSNotification(0)
  console.log("notifi job1********************")
});

let job2 = cron.schedule('50 30 3 * * *', () => {
  sentOSNotification(1)
  console.log("notifi job2********************")
});

let job3 = cron.schedule('50 30 6 * * *', () => {
  sentOSNotification(2)
  console.log("notifi job3********************")
});

let job4 = cron.schedule('50 30 9 * * *', () => {
  sentOSNotification(3)
  console.log("notifi job4********************")
});

let job5 = cron.schedule('50 30 12 * * *', () => {
  sentOSNotification(4)
  console.log("notifi job5********************")
});

let job6 = cron.schedule('50 30 15 * * *', () => {
  sentOSNotification(5)
  console.log("notifi job6********************")
});

let job7 = cron.schedule('50 15 12 * * *', () => {
  sentOSNotification(6)
  console.log("notifi job7********************")
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
    job7.start()
  }
  if(command==='stop'){
    job1.stop()
    job2.stop()
    job3.stop()
    job4.stop()
    job5.stop()
    job6.stop()
    job7.stop()
  }
  
  res.status(200).json({ name: 'success', date: date.toLocaleString() })
}




