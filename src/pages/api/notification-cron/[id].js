const cron = require('node-cron');
import { connectDB } from '../../../db';
const UserModel = require('../../../models/user');
import sentOSNotification from "../../../../handler/handleOSPushNotificaiton";


let job1 = cron.schedule('24 11 * * *', async() => {
  console.log("################################## cron1")
  // Task to be executed
  //CONNECT TO MONGODB DATABASE 
  connectDB();

  const user = await UserModel.findOne({ mobile:"+918983712448" });
  if (!user) {
    return res.status(400).json({ error: 'User mobile does not exist' });
  } else {
    user.countCron = user.countCron?user.countCron+1:1;
  }
    

    // UPDATE USER INFO IN DB
    await user.save();
  console.log('Cron job executed!');
});

let job2 = cron.schedule('54 5 * * *', async() => {
  console.log("################################## cron2")
  // Task to be executed
  //CONNECT TO MONGODB DATABASE 
  connectDB();

  const user = await UserModel.findOne({ mobile:"+918983712448" });
  if (!user) {
    return res.status(400).json({ error: 'User mobile does not exist' });
  } else {
    user.countCron = user.countCron?user.countCron+1:1;
  }
    

    // UPDATE USER INFO IN DB
    await user.save();
  console.log('Cron job executed!');
});




// const updateUser = async (req, res) => {

//   try {

//     //CONNECT TO MONGODB DATABASE 
//     connectDB();

//     const user = await UserModel.findOne({ mobile:"+918983712448" });
//     if (!user) {
//       return res.status(400).json({ error: 'User mobile does not exist' });
//     } else {
//       user.count =  user.count?user.count+1:1;
      

//       // UPDATE USER INFO IN DB
//       await user.save();
//       return res.status(200).json({ message: 'User updated' });
//     }
//   } catch (e) {
//     console.log("Method- updateUser :", e);
//     return res.status(500).json({ error: "Error in updating user." })
//   }

// }

// const testCron = ()=>{
//   let job1 = cron.schedule('0 6,12 * * *', async() => {
//     // Task to be executed
//     //CONNECT TO MONGODB DATABASE 
//     connectDB();

//     const user = await UserModel.findOne({ mobile:"+918983712448" });
//     if (!user) {
//       return res.status(400).json({ error: 'User mobile does not exist' });
//     } else {
//       user.countCron = user.countCron?user.countCron+1:1;
//     }
      

//       // UPDATE USER INFO IN DB
//       await user.save();
//     console.log('Cron job executed!');
//   });
// }

export default async function handler(req, res) {
  job1.start()
  job2.start()
  res.status(200).json({ date: new Date() });

  // await updateUser(req, res);
  // testCron();
  
  // let { id=0 } = req?.query || {};

  // id = isNaN(parseInt(id))?0:parseInt(id);

  // console.log("reached :")
  //  await sentOSNotification(id);
  //  console.log("reached : send")

  // res.status(200).json({ success: true });
}