// Import necessary modules
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new router instance
const auth = require('../Middleware/auth'); // Import authentication middleware
const entriesController = require('../Controllers/entriesController'); // Import entries controller
const upload = require('../Middleware/upload'); // Import upload middleware

// Define routes for entry operations

// GET all entries for the authenticated user
router.get('/', auth, entriesController.getEntries);

// GET a specific entry by ID for the authenticated user
router.get('/:id', auth, entriesController.getEntry);

// POST a new entry for the authenticated user
router.post('/', auth, upload.single('image'), entriesController.addEntry);

// DELETE a specific entry by ID for the authenticated user
router.delete('/:id', auth, entriesController.deleteEntry);

// PUT (update) a specific entry by ID for the authenticated user
router.put('/:id', auth, upload.single('image'), entriesController.updateEntry);

// Export the router for use in the main application
module.exports = router; // Export the entries route

//entries goes through entries route which is a router that takes you to controller where logic is handled