require('dotenv').config(); // Load environment variables from a .env file

const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const cookieParser = require('cookie-parser'); // Middleware for parsing cookies
const userRoute = require('./Routes/userRoute.js'); // Import user routes
const entriesRoute = require('./Routes/entriesRoute.js'); // Import entries routes
const todoRoute = require('./Routes/todoRoute.js'); // Import todo routes
const cors = require('cors'); // Import CORS middleware

// Retrieve environment variables for configuration
const PORT = process.env.PORT || 3333; // Port for the server to listen on
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017'; // MongoDB connection URL
const DB_NAME = process.env.DB_NAME || 'swe-blog'; // MongoDB database name

const app = express(); // Create an instance of the Express application

// Enable query debugging (uncomment to enable)
// mongoose.set('debug', true); 

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to handle CORS (Cross-Origin Resource Sharing) errors
app.use(cors());

// Ensure uploads directory exists
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(uploadsDir, 'images');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes for the application
app.use('/api/users', userRoute); // User-related routes
app.use('/entries', entriesRoute); // Blog entries routes
app.use('/api/todos', todoRoute); // Todo-related routes

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
    const errorLog = Object.assign({}, errorObj, err);
    console.error('Server error:', errorLog.log);
    return res.status(errorLog.status).json(errorLog.message);
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