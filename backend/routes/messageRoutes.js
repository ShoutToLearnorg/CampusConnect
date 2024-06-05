const express = require('express');
const { sendMessage, getMessagesBetweenUsers } = require('../controllers/messageController'); // Import the getMessagesBetweenUsers function
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();
router.post('/', authenticateToken, sendMessage);


router.post('/sendMessage', authenticateToken, sendMessage);
router.get('/:sender/:recipient', authenticateToken, getMessagesBetweenUsers); // Use the imported function

module.exports = router;
