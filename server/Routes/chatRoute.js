const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 4 * 1024 * 1024, // 4MB max file size
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Remove the '/chat' prefix since the full path will be '/api/chat' from server.js
// Route for chat with optional image upload
router.post('/', upload.single('image'), chatController.getChatResponse);

module.exports = router;