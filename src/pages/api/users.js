import { connectDB } from '../../db';
const UserModel = require('../../models/user');

const getUser = async (req, res) => {
  try {
    const { mobile } = req?.body;
    if (!mobile) return res.status(400).json({ error: "Please provide mobile number" });

    //CONNECT TO MONGODB DATABASE 
    connectDB();

    const user = await UserModel.findOne({ mobile });

    return res.status(200).json({ data: user });
  } catch (e) {
    console.log("Method- getUser :", e);
    return res.status(500).json({ message: 'Error fetching user' });
  }
}

const saveUser = async (req, res) => {
  try {
    const { mobile, name, email = "", prefLanguage = "", prefNews = "", expoToken = "" } = req?.body;
    if (!mobile) return res.status(400).json({ error: "Please provide mobile number" });
    if (!name) return res.status(400).json({ error: "Please provide user name" });

    //CONNECT TO MONGODB DATABASE 
    connectDB();

    const user = await UserModel.findOne({ mobile });

    if (user) {
      return res.status(200).json({"message": "User already exists", data:user});
    } else {
      await UserModel.create({ mobile, name, email, prefLanguage, prefNews, expoToken });
      return res.status(200).json({ message: 'User created' });
    }
  } catch (e) {
    console.log("Method- saveUser :", e);
    res.status(500).json({ error: 'Error in creating user.' });
  }
}

const updateUser = async (req, res) => {

  try {
    const { mobile, name, email, prefLanguage, prefNews, expoToken, OSExternalUserId } = req?.body;
    if (!mobile) return res.status(400).json({ error: "Please provide mobile number" });

    //CONNECT TO MONGODB DATABASE 
    connectDB();

    const user = await UserModel.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ error: 'User mobile does not exist' });
    } else {
      if (name) user.name = name;
      if (email) user.email = email;
      if (prefLanguage) user.prefLanguage = prefLanguage;
      if (prefNews) user.prefNews = prefNews;
      if (expoToken) user.expoToken = expoToken;
      if(OSExternalUserId) user.OSExternalUserId = OSExternalUserId;

      // UPDATE USER INFO IN DB
      await user.save();
      return res.status(200).json({ message: 'User updated' });
    }
  } catch (e) {
    console.log("Method- updateUser :", e);
    return res.status(500).json({ error: "Error in updating user." })
  }

}

// HANDLE ALL USER REQUEST
const handler = async (req, res) => {
  if (req.method === 'GET') {
    getUser(req, res)
  } else if (req.method === 'POST') {
    saveUser(req, res);
  } else if (req.method === 'PUT') {
    await updateUser(req, res);
  }
  else {
    res.status(400).json({ error: 'Invalid request method' });
  }
};

export default handler;
