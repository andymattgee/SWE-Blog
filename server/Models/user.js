const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating tokens
const Schema = mongoose.Schema; // Create a Schema constructor

// Define the schema for a User
const userSchema = new Schema({
    userName: {
        type: String,
        required: true // Username, required field
    },
    password: {
        type: String,
        required: true // Password, required field
    },
    email: {
        type: String,
        required: false // Optional email field
    },
    image: {
        type: String,
        required: false // Optional image URL for the user
    },
    entries: [{
        type: Schema.Types.ObjectId,
        ref: 'Entry' // Reference to the user's entries
    }],
    todos: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo' // Reference to the user's todos
    }],
    tokens: [{ // Array to store authentication tokens
        token: {
            type: String,
            required: true // Token is required
        }
    }]
});

// Pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function(next) {
    const user = this; // Reference to the user being saved
    if (user.isModified('password')) { // Check if the password has been modified
        user.password = await bcrypt.hash(user.password, 8); // Hash the password with bcrypt
    }
    next(); // Proceed to the next middleware
});

// Method to generate an authentication token for the user
userSchema.methods.generateAuthToken = async function() {
    const user = this; // Reference to the user
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'default_jwt_secret'); // Generate a token
    user.tokens = user.tokens.concat({ token }); // Add the token to the user's tokens array
    await user.save(); // Save the user with the new token
    return token; // Return the generated token
};

// Static method to find a user by credentials (username and password)
userSchema.statics.findByCredentials = async (userName, password) => {
    const user = await User.findOne({ userName }); // Find the user by username
    if (!user) {
        throw new Error('Unable to login'); // Throw an error if user not found
    }
    const isMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the stored hashed password
    if (!isMatch) {
        throw new Error('Unable to login'); // Throw an error if passwords do not match
    }
    return user; // Return the found user
};

// Create the User model using the defined schema
const User = mongoose.model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;