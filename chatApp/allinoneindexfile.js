const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;

// Middleware setup
app.use(cors({
  origin: 'http://localhost:8100',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/chatApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Could not connect to MongoDB", err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String },
  college: { type: String },
  department: { type: String },
  profilePicture: { type: String },
});
const User = mongoose.model('User', userSchema);

// In-memory storage for user sockets
const userSockets = {};

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Registration Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ error: 'Error registering user' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id, username: user.username }, '5e73a96d9be45046ae4f6f75951ab37a003cea341a1dec90c4b9a8531f6d9f03');

  res.status(200).send({ token, username: user.username });
});

// Get all users route
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email'); // Fetch username and email only
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get user by username route
app.get('/users/:username', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ username });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to update user profile

  app.post('/users/:username/update-profile', async (req, res) => {
    const { fullName, college, department } = req.body;
    const { username } = req.params;

    try {
        const updatedUser = await User.findOneAndUpdate({ username }, { fullName, college, department }, { new: true });
        if (updatedUser) {
            console.log('Profile updated successfully:', updatedUser);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update user profile including profile picture
app.post('/users/:username', upload.single('profilePicture'), async (req, res) => {
    const { username } = req.params;
    const { fullName, college, department } = req.body;
    const profilePicture = req.file ? req.file.filename : null;
  
    console.log('Updating user profile for:', username);
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
  
    try {
      const user = await User.findOne({ username });
      if (user) {
        console.log('User found:', user);
        user.fullName = fullName || user.fullName;
        user.college = college || user.college;
        user.department = department || user.department;
        if (profilePicture) {
          user.profilePicture = profilePicture;
        }
        await user.save();
        console.log('Updated user:', user);
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile', error });
    }
  });

  // Add a route to fetch profile picture URL
app.get('/users/:username/profile-picture', async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ username });
      if (user && user.profilePicture) {
        res.json({ profilePictureUrl: user.profilePicture });
      } else {
        res.status(404).json({ error: 'Profile picture not found' });
      }
    } catch (error) {
      console.error('Error fetching profile picture URL:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Add a messages array to store chat messages
const messages = [];

// Send message
app.post('/sendMessage', async (req, res) => {
  const { sender, recipient, message } = req.body;

  if (!sender || !recipient || !message) {
    return res.status(400).json({ error: 'Invalid message data' });
  }

  try {
    // Add the message to the messages array
    const newMessage = { sender, recipient, message };
    messages.push(newMessage);

    // Emit the message to the recipient's room
    if (userSockets[recipient]) {
      io.to(userSockets[recipient]).emit('receiveMessage', newMessage);
    }

    // Send a response indicating that the message was sent successfully
    res.status(200).json(newMessage); // Send the new message as response
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get messages between two users
app.get('/messages/:sender/:recipient', async (req, res) => {
  const { sender, recipient } = req.params;

  try {
    // Filter messages based on sender and recipient
    const conversation = messages.filter(
      msg => (msg.sender === sender && msg.recipient === recipient) ||
        (msg.sender === recipient && msg.recipient === sender)
    );

    // Return the conversation
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('Access denied');
  }

  try {
    const verified = jwt.verify(token, '5e73a96d9be45046ae4f6f75951ab37a003cea341a1dec90c4b9a8531f6d9f03');
    req.user = verified;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(400).send('Invalid token');
  }
};

// Profile Update Route
app.post('/users/:username', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  const { username } = req.params;
  const { fullName, college, department } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  console.log('Updating user profile for:', username);
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  try {
    const user = await User.findOne({ username });
    if (user) {
      user.fullName = fullName;
      user.college = college;
      user.department = department;
      if (profilePicture) {
        user.profilePicture = profilePicture;
      }
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
});

// Protected Route example
app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

// Create an HTTP server
const server = http.createServer(app);

// Initialize socket.io with the server
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8100',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle user connection and store socket
  socket.on('register', (username) => {
    userSockets[username] = socket.id;
    console.log(`User ${username} registered with socket ID ${socket.id}`);
  });

  // Handle receiving a message from the sender
  socket.on('sendMessage', (data) => {
    const { sender, recipient, message } = data;

    // Validate message data
    if (!sender || !recipient || !message) return;

    // Emit the message to the recipient's room
    if (userSockets[recipient]) {
      io.to(userSockets[recipient]).emit('receiveMessage', { sender, message });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    // Remove disconnected user from userSockets
    for (const [username, socketId] of Object.entries(userSockets)) {
      if (socketId === socket.id) {
        delete userSockets[username];
        console.log(`User ${username} disconnected`);
        break;
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
