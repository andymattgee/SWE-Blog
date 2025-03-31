require('dotenv').config(); // Load environment variables from a .env file

const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const cookieParser = require('cookie-parser'); // Middleware for parsing cookies
const userRoute = require('./Routes/userRoute.js'); // Import user routes
const entriesRoute = require('./Routes/entriesRoute.js'); // Import entries routes
const chatRoute = require('./Routes/chatRoute.js'); // Import chat routes
const cors = require('cors'); // Import CORS middleware
const path = require('path'); // Import path module for file paths

// Retrieve environment variables for configuration
const PORT = process.env.PORT || 3333; // Port for the server to listen on
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017'; // MongoDB connection URL
const DB_NAME = process.env.DB_NAME || 'swe-blog'; // MongoDB database name

// Check if AWS credentials are available
const useS3 = process.env.AWS_ACCESS_KEY_ID && 
              process.env.AWS_SECRET_ACCESS_KEY && 
              process.env.AWS_REGION && 
              process.env.AWS_BUCKET_NAME;

if (!useS3) {
    console.error('AWS credentials are missing. S3 upload will not work!');
    console.error('Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_BUCKET_NAME in your .env file');
}

const app = express(); // Create an instance of the Express application

// Enable query debugging (uncomment to enable)
// mongoose.set('debug', true); 

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to handle CORS (Cross-Origin Resource Sharing) errors
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes for the application
app.use('/api/users', userRoute); // User-related routes
app.use('/entries', entriesRoute); // Blog entries routes
app.use('/api/chat', chatRoute); // Chatbot routes

// Handle 404 errors for any undefined routes
app.use('*', (req, res) => { 
    res.sendStatus(404); // Send a 404 status code for not found
});

// Error handling middleware
app.use((err, req, res, next) => {
    const errorObj = {
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'An error occurred' },
    };
    
    // Enhance error object with more details
    const errorLog = Object.assign({}, errorObj, err);
    
    // Log detailed error information
    console.error('Server error:', errorLog.log);
    console.error('Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    console.error('Error stack:', err.stack);
    
    // Send error response to client
    return res.status(errorLog.status).json({
        message: errorLog.message.err || 'An error occurred',
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

// Connect to MongoDB and start server
mongoose
    .connect(DB_URL, { dbName: DB_NAME }) 
    .then(() => {
        console.info('Connected to MongoDB');
        app.listen(PORT, () => {
            console.info(`Server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

module.exports = app; // Export the app for testing or further configuration