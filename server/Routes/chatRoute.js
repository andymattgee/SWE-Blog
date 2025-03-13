const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');

// Remove the '/chat' prefix since the full path will be '/api/chat' from server.js
router.post('/', chatController.getChatResponse);


module.exports = router;