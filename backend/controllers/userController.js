const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const Otp = require('../models/otp');
const TempUser = require('../models/tempUserModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('./sendEmail');

const generateOtp = () => {
  return crypto.randomBytes(3).toString('hex');
};

const register = async (req, res) => {
  try {
    const { username, email, password, fullName, department } = req.body;

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const otp = generateOtp();

    const tempUser = new TempUser({
      username,
      email,
      password,
      fullName,
      department,
      otp
    });

    await tempUser.save();

    await sendEmail(email, 'Verify your email', `Your OTP is ${otp}`);

    res.status(201).json({ message: 'OTP sent successfully. Please check your email.', tempUserId: tempUser._id });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;

    const tempUser = await TempUser.findOne({ _id: tempUserId, otp });

    if (!tempUser) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(tempUser.password, 10);

    const newUser = new User({
      username: tempUser.username,
      email: tempUser.email,
      password: hashedPassword,
      fullName: tempUser.fullName,
      department: tempUser.department
    });

    await newUser.save();

    await TempUser.deleteOne({ _id: tempUserId });

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid email or password');
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET);
    console.log("Generated Token:", token);

    res.status(200).send({ token, username: user.username });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }, '-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 // Update user profile endpoint
 const updateProfile = async (req, res) => {
  const { fullName, department } = req.body;
  const { username } = req.params;
  const profilePicture = req.file ? req.file.filename : null;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { fullName, department, ...(profilePicture && { profilePicture }) },
      { new: true }
    );

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateProfilePicture = async (req, res) => {
  const { username } = req.params;
  const profilePicture = req.file ? req.file.filename : null;

  try {
    const user = await User.findOne({ username });
    if (user) {
      if (profilePicture) {
        user.profilePicture = profilePicture;
      }
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProfilePicture = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (user && user.profilePicture) {
      res.json({ profilePictureUrl: `/uploads/${user.profilePicture}` });
    } else {
      res.status(404).json({ error: 'Profile picture not found' });
    }
  } catch (error) {
    console.error('Error fetching profile picture URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserStatus = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }, 'fullName isOnline lastSeen');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




const checkUsernameAvailability = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  } catch (error) {
    console.error('Error checking username availability:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const checkEmailAvailability = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ available: false });
    } else {
      return res.json({ available: true });
    }
  } catch (error) {
    console.error('Error checking email availability:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  verifyOtp,
  login,
  getAllUsers,
  getUserByUsername,
  updateProfile,
  updateProfilePicture,
  getProfilePicture,
  checkUsernameAvailability,
  checkEmailAvailability,
  getUserStatus,

};
