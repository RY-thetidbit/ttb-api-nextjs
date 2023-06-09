import { connectDB } from '../../db'; 
const UserModel = require('../../models/user'); // Replace with your token model schemaa

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { favouriteNews, mobile } = req.body;

      // Save the token to MongoDB
      connectDB(); // Connect to the MongoDB database
      // Check if the token already exists
      const existingToken = await UserModel.findOne({ mobile });

      if (existingToken) {
        // Token already exists, update it
        existingToken.favouriteNews = favouriteNews;
        await existingToken.save();
      } else {
        // Token does not exist, create a new document
        res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'Registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to Registered' });
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
};

export default handler;
