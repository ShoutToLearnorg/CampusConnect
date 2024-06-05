const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String },
  department: { type: String },
  profilePicture: { type: String },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
