import mongoose from 'mongoose';

const appInfoSchema = new mongoose.Schema({
  versionPS: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AppInfoModel = mongoose.model('appInfo', appInfoSchema);

module.exports = AppInfoModel;
