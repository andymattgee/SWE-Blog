const express = require('express');
const router = express.Router();
const aiSummaryController = require('../controllers/aiSummaryController');
const authMiddleware = require('../middleware/auth');

// Route to get an AI summary of an entry's content
// Protected by authentication middleware
router.post('/generate', authMiddleware, aiSummaryController.generateSummary);

module.exports = router; 