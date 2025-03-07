// Import necessary modules
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new router instance
const User = require('../Models/user'); // Import User model
const auth = require('../Middleware/auth'); // Import authentication middleware
const userController = require('../Controllers/userController'); // Import user controller

// Route for user registration
router.post('/register', userController.register); // Handle user registration

// Route for user login
router.post('/login', userController.login); // Handle user login

// Route for user logout
router.post('/logout', auth, userController.logout); // Handle user logout with authentication

// Export the router for use in the main application
module.exports = router; // Export the user route

//no router, all logic is handled here inside the route instead of routing to controller