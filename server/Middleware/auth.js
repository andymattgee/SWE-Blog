const jwt = require('jsonwebtoken');
const User = require('../Models/user');
require('dotenv').config();

/**
 * Authentication middleware for verifying JWT tokens.
 * This middleware extracts the JWT token from the Authorization header,
 * verifies it, and attaches the authenticated user to the request object.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const auth = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        console.log('Auth middleware - Authorization header:', authHeader ? 'Present' : 'Missing');
        
        if (!authHeader) {
            return res.status(401).json({
                message: 'Authentication failed. No token provided.'
            });
        }
        
        // Extract the token (remove 'Bearer ' prefix if present)
        const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
        console.log('Auth middleware - Token found:', token.substring(0, 10) + '...');
        
        if (!token) {
            return res.status(401).json({
                message: 'Authentication failed. No token provided.'
            });
        }
        
        // Verify the token using the JWT_SECRET from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - Token decoded, user ID:', decoded._id);
        
        // Find the user by ID from the decoded token
        const user = await User.findById(decoded._id);
        
        if (!user) {
            console.log('Auth middleware - User not found for ID:', decoded._id);
            return res.status(401).json({
                message: 'Authentication failed. User not found.'
            });
        }
        
        // Attach the authenticated user to the request object
        req.user = user;
        console.log('Auth middleware - User authenticated:', user.username);
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Auth middleware - Error:', error.message);
        console.error('Auth middleware - Error stack:', error.stack);
        
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Authentication failed. Invalid token.'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Authentication failed. Token expired.'
            });
        }
        
        // Handle other errors
        return res.status(500).json({
            message: 'Authentication failed. Server error.',
            error: error.message
        });
    }
};

module.exports = auth;
