require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const middleware = require('./config/middleware');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const communityRoutes = require('./routes/communityRoutes')
const tabsRouter = require('./routes/tabRoutes');
const User = require('./models/userModel');
const commentRoutes = require('./routes/comments');
const communityPost =require('./models/communityPosts')
const BlogPost = require('./models/comments');


const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

middleware(app);

app.use('/api/users/', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/community', communityRoutes); // Mount the community routes
app.use('/api/comments', commentRoutes);
app.use('/api/posts', BlogPost);
app.use('/tabs', tabsRouter);
const server = http.createServer(app);

const userSockets = {};

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8100',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

// Inside your socket connection handler
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('register', async (username) => {
    userSockets[username] = socket.id;
    console.log(`User ${username} registered with socket ID ${socket.id}`);

    // Set user as online
    await User.findOneAndUpdate({ username }, { isOnline: true });

    // Broadcast the status update to all clients
    io.emit('statusUpdate', { username, isOnline: true });
  });

  socket.on('sendMessage', (data) => {
    const { sender, recipient, message, timestamp } = data;

    if (!sender || !recipient || !message) return;

    const newMessage = { sender, recipient, message, timestamp: timestamp || new Date() };

    if (userSockets[recipient]) {
      io.to(userSockets[recipient]).emit('receiveMessage', newMessage);
    }

    // Optionally, you can store the message in the database here
  });

  socket.on('newPost', (post) => {
    io.emit('postUpdated', post);
  });

  socket.on('newComment', ({ postId, comment }) => {
    io.emit('postUpdated', { postId, comment });
  });

  socket.on('newReply', ({ postId, reply }) => {
    io.emit('postUpdated', { postId, reply });
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected');

    for (const [username, socketId] of Object.entries(userSockets)) {
      if (socketId === socket.id) {
        delete userSockets[username];
        console.log(`User ${username} disconnected`);

        // Set user as offline and update last seen
        await User.findOneAndUpdate(
          { username },
          { isOnline: false, lastSeen: Date.now() }
        );

        // Broadcast the status update to all clients
        io.emit('statusUpdate', { username, isOnline: false, lastSeen: Date.now() });
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
