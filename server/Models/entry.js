// import {model, Schema} from 'mongoose';
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const Schema = mongoose.Schema; // Create a Schema constructor

// Define the schema for an Entry
const EntrySchema = new Schema({
    title: {
        type: String,
        required: true // Title of the entry, required field
    },
    professionalContent: {
        type: String,
        required: true // Professional content, required field
    },
    personalContent: {
        type: String,
        required: false // Personal content, optional field
    },
    date: {
        type: Date,
        required: false // Date of the entry, optional field
    },
    createdAt: {
        type: Date,
        default: Date.now // Timestamp for when the entry was created, defaults to now
    },
    image: {
        type: String,
        required: false // Optional image URL associated with the entry
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User' // Reference to the User who created the entry
    }
});

// Create the Entry model using the defined schema
const Entry = mongoose.model('Entry', EntrySchema);

// Export the Entry model for use in other parts of the application
module.exports = Entry;