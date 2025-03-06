//create a mongoose model for todos that will include title,notes,priority,status,date
//add a user property to tie it to the logged in user 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    task: {
        type: String, 
        required: [true, 'Task title is required']
    },
    notes: {
        type: String, 
        default: ''
    },
    priority: {
        type: String, 
        enum: ['high', 'low'],
        default: 'low'
    },
    completed: {
        type: Boolean,
        default: false
    },
    deadlineDate: {
        type: Date,
        required: [true, 'Deadline date is required']
    },
    createdAt: {
        type: Date, 
        default: Date.now,
        immutable: true
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}); 

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;