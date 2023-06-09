import { connectDB } from '../../db';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { token } = req.query;

      // Save the token to MongoDB
      connectDB(); // Connect to the MongoDB database
      const AppInfoModel = require('../../models/appInfo'); // Replace with your token model schema
      //  await AppInfoModel.create({versionPS:"3.0.45" })
      // Check if the token already exists
      const appInfo = await AppInfoModel.find({});

      res.status(200).json({versionPS:appInfo[0]['versionPS']});
    } catch (error) {
      console.log("Error in hanlde appinfo:", error)
      res.status(500).json({ error: 'Failed to save token' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
};

export default handler;
