// Create a mongoose model for todos that will include title, notes, priority, status, date
// Add a user property to tie it to the logged-in user 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a Todo item
const TodoSchema = new Schema({
    // The title of the task, required for every todo
    task: {
        type: String, 
        required: [true, 'Task title is required']
    },
    // Additional notes for the task, optional
    notes: {
        type: String, 
        default: ''
    },
    // Priority of the task, can be either 'high' or 'low', defaults to 'low'
    priority: {
        type: String, 
        enum: ['high', 'low'],
        default: 'low'
    },
    // Indicates whether the task is completed or not, defaults to false
    completed: {
        type: Boolean,
        default: false
    },
    // Deadline date for the task, required for every todo
    deadlineDate: {
        type: Date,
        required: [true, 'Deadline date is required']
    },
    // Timestamp for when the todo was created, immutable
    createdAt: {
        type: Date, 
        default: Date.now,
        immutable: true
    },
    // Reference to the user who created the todo, required
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}); 

// Create the Todo model using the defined schema
const Todo = mongoose.model('Todo', TodoSchema);

// Export the Todo model for use in other parts of the application
module.exports = Todo;