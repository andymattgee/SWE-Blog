//create a mongoose model for todos that will include title,notes,priority,status,date
//add a user property to tie it to the logged in user 

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: {type: String, required: true},
    notes: {type: String, required: false},
    priority: {type: String, required: false},
    status: {type: String, required: false},
    date: {type: Date, required: false},
    createdAt: {type: Date, default: Date.now},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
}); 

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;