const jwt = require('jsonwebtoken'); // Import jsonwebtoken for verifying tokens
const User = require('../Models/user'); // Import the User model

/**
 * Middleware function to authenticate users based on JWT.
 * It checks for a valid token in the Authorization header,
 * verifies the token, and attaches the user to the request object.
 * If authentication fails, it sends a 401 Unauthorized response.
 * 
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const auth = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Check if the token is present
    if (!token) {
      throw new Error('No token found');
    }
    
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');

    // Check if the decoded token contains a valid user ID
    if (!decoded._id) {
      throw new Error('Token does not contain a valid user ID');
    }
    
    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Attach the token and user to the request object for use in subsequent middleware/routes
    req.token = token;
    req.user = user;
    next(); // Call the next middleware function
  } catch (error) {
    // Send a 401 Unauthorized response if authentication fails
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth; // Export the auth middleware for use in other parts of the application
