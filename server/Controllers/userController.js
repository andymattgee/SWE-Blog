const User = require('../Models/user'); // Import User model
const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison

/**
 * Registers a new user.
 * @param {Object} req - The request object containing user data
 * @param {Object} res - The response object for sending responses
 */
const register = async (req, res) => {
    try {
        // Explicitly create user with expected fields (email, password)
        const user = new User({
            email: req.body.email,
            password: req.body.password
            // Add other fields like firstName, lastName if they are sent and needed in the model
        });
        await user.save(); // Save the user to the database
        const token = await user.generateAuthToken(); // Generate an authentication token
        // Ensure a consistent success response structure
        res.status(201).send({ success: true, user, token });
    } catch (error) {
        console.error('Error registering user:', error);
        // Send a structured error response
        // Enhance error message for duplicate email
        if (error.code === 11000 || (error.message && error.message.includes('E11000'))) {
             return res.status(400).send({ success: false, message: 'Email already exists. Please use a different email or login.' });
        }
        res.status(400).send({ success: false, message: error.message || 'Registration failed', error: error });
    }
};

/**
 * Logs in an existing user.
 * @param {Object} req - The request object containing login credentials
 * @param {Object} res - The response object for sending responses
 */
const login = async (req, res) => {
    try {
        // Use email for authentication
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' }); // Update error message
        }
        const token = await user.generateAuthToken(); // Generate an authentication token
        res.send({ user, token }); // Respond with user data and token
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(400).send({ error: 'Unable to login. Please check your email and password.' }); // Update error message
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
        console.error('Error logging out user:', error);
        res.status(500).send(error); // Handle logout errors
    }
};

/**
 * Changes user's password after verifying current password.
 * @param {Object} req - The request object containing passwords
 * @param {Object} res - The response object for sending responses
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, req.user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Update password
        req.user.password = newPassword;
        await req.user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(400).json({ error: 'Unable to change password' });
    }
};

// Export the controller functions for use in routes
module.exports = {
    register,
    login,
    logout,
    changePassword
};
