// messageController.js
const Message = require('../models/message');

const sendMessage = async (req, res) => {
  const { sender, recipient, message } = req.body;

  if (!sender || !recipient || !message) {
    return res.status(400).json({ error: 'Invalid message data' });
  }

  try {
    const newMessage = new Message({
      sender,
      recipient,
      message,
      timestamp: new Date() // Include the current timestamp
    });
    await newMessage.save();

    res.status(200).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMessagesBetweenUsers = async (req, res) => {
  const { sender, recipient } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  sendMessage,
  getMessagesBetweenUsers,
};
