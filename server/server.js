require('dotenv').config(); // Load environment variables from a .env file

const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const cookieParser = require('cookie-parser'); // Middleware for parsing cookies
const userRoute = require('./Routes/userRoute.js'); // Import user routes
const entriesRoute = require('./Routes/entriesRoute.js'); // Import entries routes
const todoRoute = require('./Routes/todoRoute.js'); // Import todo routes
const cors = require('cors'); // Import CORS middleware

// Retrieve environment variables for configuration
const PORT = process.env.PORT; // Port for the server to listen on
const DB_URL = process.env.DB_URL; // MongoDB connection URL
const DB_NAME = process.env.DB_NAME; // MongoDB database name

const app = express(); // Create an instance of the Express application

// Enable query debugging (uncomment to enable)
// mongoose.set('debug', true); 

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to handle CORS (Cross-Origin Resource Sharing) errors
app.use(cors());

// Define routes for the application
app.use('/api/users', userRoute); // User-related routes
app.use('/entries', entriesRoute); // Blog entries routes
app.use('/api/todos', todoRoute); // Todo-related routes

// Handle 404 errors for any undefined routes
app.use('*', (req, res) => { 
    res.sendStatus(404); // Send a 404 status code for not found
});

// Global error handler for the application
app.use((err, req, res, next) => {
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 500,
        message: { err: 'An error occurred / Global Error handler' },
    };
    const errorObj = Object.assign({}, defaultErr, err); // Merge default error with the actual error
    console.log(errorObj.log); // Log the error message
    return res.status(errorObj.status).json(errorObj.message); // Send error response
});

// Connect to MongoDB and start the server
mongoose
    .connect(DB_URL, { dbName: DB_NAME }) // Connect to the database
    .then(() => {
        console.log('Connected to MongoDB...'); // Log success message
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`); // Start the server and log the port
        });  
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message); // Log any connection errors
    });

module.exports = app; // Export the app for testing or further configuration