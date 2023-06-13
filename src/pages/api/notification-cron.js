var cron = require('node-cron');
import sentOSNotification from "../../../handler/handleOSPushNotificaiton";

let job1 = cron.schedule(`6 * * *'`, () => {
  console.log('running a task every minute1', m.toLocaleString());
  sentOSNotification(0)
});

let job2 = cron.schedule('30 6 * * *', () => {
  console.log('running a task every minute1', m.toLocaleString());
  sentOSNotification(1)
});

let job3 = cron.schedule('9 * * *', () => {
  console.log('running a task every minute1', m.toLocaleString());
  sentOSNotification(2)
});

let job4 = cron.schedule('12 * * *', () => {
  console.log('running a task every minute1', m.toLocaleString());
  sentOSNotification(3)
});

let job5 = cron.schedule('17 * * *', () => {
  console.log('running a task every minute1', m.toLocaleString());
  sentOSNotification(4)
});

let job6 = cron.schedule('21 * * *', () => {
  console.log('running a task every minute1', m.toLocaleString());
  sentOSNotification(5)
});

export default function handler(req, res) {
  let { command } = req?.query || {};

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
  }
  
  res.status(200).json({ name: 'success', date: new Date() })
}




