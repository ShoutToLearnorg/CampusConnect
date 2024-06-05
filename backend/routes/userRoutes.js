const express = require('express');
const {
  register,
  login,
  getAllUsers,
  getUserByUsername,
  updateProfile,
  updateProfilePicture,
  getProfilePicture,
  checkUsernameAvailability,
  checkEmailAvailability,
  verifyOtp,
  getUserStatus,  
} = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Middleware to update URL with username
router.use('/:username/*', (req, res, next) => {
  // Assuming you have stored user information in the request object after authentication
  const username = req.params.username;
  req.url = req.url.replace(`/${username}`, ''); // Remove username from URL path
  next();
});

// Routes for user registration and login
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

// Routes for authenticated user actions
router.get('/', authenticateToken, getAllUsers);
router.get('/:username', authenticateToken, getUserByUsername);
router.post('/:username/update-profile', authenticateToken, upload.single('profilePicture'), updateProfile);
router.post('/:username/profile-picture', authenticateToken, upload.single('profilePicture'), updateProfilePicture);
router.get('/:username/profile-picture', authenticateToken, getProfilePicture);
router.get('/:username/status', authenticateToken, getUserStatus); 

// Routes for checking availability
router.post('/check-username', checkUsernameAvailability);
router.post('/check-email', checkEmailAvailability);

module.exports = router;