const User = require('../Models/user'); // Import User model

/**
 * Registers a new user.
 * @param {Object} req - The request object containing user data
 * @param {Object} res - The response object for sending responses
 */
const register = async (req, res) => {
    console.log('req body ->', req.body); // Log the request body
    const user = new User(req.body); // Create a new user instance
    try {
        await user.save(); // Save the user to the database
        const token = await user.generateAuthToken(); // Generate an authentication token
        res.status(201).send({ user, token }); // Respond with user data and token
    } catch (error) {
        res.status(400).send(error); // Handle registration errors
    }
};

/**
 * Logs in an existing user.
 * @param {Object} req - The request object containing login credentials
 * @param {Object} res - The response object for sending responses
 */
const login = async (req, res) => {
    try {
        console.log('req.body from login ->', req.body); // Log the request body
        const user = await User.findByCredentials(req.body.userName, req.body.password); // Authenticate user
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' }); // Handle invalid credentials
        }
        const token = await user.generateAuthToken(); // Generate an authentication token
        res.send({ user, token }); // Respond with user data and token
    } catch (error) {
        res.status(400).send({ error: 'Unable to login' }); // Handle login errors
    }
};

/**
 * Logs out the authenticated user.
 * @param {Object} req - The request object containing user information
 * @param {Object} res - The response object for sending responses
 */
const logout = async (req, res) => {
    try {
        // Remove the current token from the user's tokens array
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token; // Filter out the current token
        });
        await req.user.save(); // Save the updated user
        res.send(); // Respond with success
    } catch (error) {
        res.status(500).send(error); // Handle logout errors
    }
};

// Export the controller functions for use in routes
module.exports = {
    register,
    login,
    logout
};
