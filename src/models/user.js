import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  prefLanguage: {
    type: String,
    required: false,
  },
  prefNews: {
    type: [String],
    required: false
  },
  expoToken: {
    type: String,
    required: false
  },
  OSExternalUserId: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  count: {
    type: Number,
    required: false
  },
  countCron: {
    type: Number,
    required: false
  },

  
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
