const cron = require('node-cron');
import { connectDB } from '../../../db';
const UserModel = require('../../../models/user');
import sentOSNotification from "../../../../handler/handleOSPushNotificaiton";


let job1 = cron.schedule('30 0 * * *', async() => {
  await sentOSNotification(0);
  console.log('Cron job executed!', new Date());
});

let job2 = cron.schedule('30 3 * * *', async() => {
  await sentOSNotification(1);
  console.log('Cron job executed!', new Date());
});

let job3 = cron.schedule('30 6 * * *', async() => {
  await sentOSNotification(2);
  console.log('Cron job executed!', new Date());
});

let job4 = cron.schedule('30 9 * * *', async() => {
  await sentOSNotification(3);
  console.log('Cron job executed!', new Date());
});

let job5 = cron.schedule('30 12 * * *', async() => {
  await sentOSNotification(4);
  console.log('Cron job executed!', new Date());
});

let job6 = cron.schedule('30 15 * * *', async() => {
  await sentOSNotification(5);
  console.log('Cron job executed!', new Date());
});

let job7 = cron.schedule('14 6 * * *', async() => {
  await sentOSNotification(5);
  console.log('Cron job executed!', new Date());
});

async function handler1(req, res) {
  job1.start();
  job2.start();
  job3.start();
  job4.start();
  job5.start();
  job6.start();
  job7.start();

  res.status(200).json({ date: new Date() });
  
}

export default async function handler(req, res) {
  
  let {notiNo=0 } = req?.query || {};

  if(!notiNo) notiNo=0;

  await sentOSNotification(notiNo);
  res.status(200).json({ date: new Date() });
  
}