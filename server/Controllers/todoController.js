// Create logic for todo that will include get, post, put, delete operations

const { get } = require('http');
const Todo = require('../Models/todos'); // Import the Todo model
const DOMPurify = require('isomorphic-dompurify'); // Import DOMPurify for HTML sanitization

// Configure DOMPurify to allow specific HTML elements and attributes for Quill content
const purifyConfig = {
    ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'div', 'span'
    ],
    ALLOWED_ATTR: ['style', 'class'],
    ALLOWED_CLASSES: [
        'ql-align-*', 'ql-direction-*', 'ql-indent-*',
        'ql-list-*', 'ql-size-*', 'ql-font-*'
    ]
};

/**
 * Fetches all todos for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getTodos = async (req, res) => {
    try {
        // Retrieve todos associated with the current user
        const todos = await Todo.find({ user: req.user._id });
        
        // Get current date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter todos into categories based on their status
        const categorizedTodos = {
            today: todos.filter(todo => {
                const createdDate = new Date(todo.createdAt);
                createdDate.setHours(0, 0, 0, 0);
                return createdDate.getTime() === today.getTime() && !todo.completed;
            }),
            overdue: todos.filter(todo => {
                return new Date(todo.deadlineDate) < today && !todo.completed;
            }),
            pending: todos.filter(todo => {
                const createdDate = new Date(todo.createdAt);
                createdDate.setHours(0, 0, 0, 0);
                return createdDate.getTime() !== today.getTime() && 
                       new Date(todo.deadlineDate) >= today && 
                       !todo.completed;
            }),
            completed: todos.filter(todo => todo.completed)
        };

        // Respond with categorized todos
        return res.status(200).json({
            success: true,
            data: categorizedTodos
        });
        
    } catch (error) {
        // Handle errors during fetching
        return res.status(500).json({
            message: 'Error fetching todos',
            error: error.message
        });
    }
};

/**
 * Adds a new todo for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const addTodo = async (req, res) => {
    try {
        // Create a new todo object from the request body
        const newTodo = {
            task: req.body.task,
            notes: req.body.notes ? DOMPurify.sanitize(req.body.notes, purifyConfig) : '',
            priority: req.body.priority,
            deadlineDate: req.body.deadlineDate,
            user: req.user._id // Associate the todo with the logged-in user
        };
        
        // Save the new todo to the database
        const todo = await Todo.create(newTodo);
        return res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: todo // Respond with the created todo data
        });
    } catch (error) {
        // Handle errors during adding
        return res.status(500).json({
            success: false,
            message: 'Error adding todo',
            error: error.message
        });
    }
};

/**
 * Fetches a specific todo by ID for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getTodo = async (req, res) => {
    const { id } = req.params; // Extract the todo ID from the request parameters
    try {
        // Find the todo by ID and ensure it belongs to the authenticated user
        const todo = await Todo.findOne({ _id: id, user: req.user._id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        // Respond with the found todo
        res.status(200).json({
            success: true,
            data: todo // Respond with the todo data
        });
    } catch (error) {
        // Handle errors during fetching
        res.status(500).json({
            message: 'Error fetching todo',
            error: error.message
        });
    }
};

/**
 * Deletes a specific todo by ID for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params; // Extract the todo ID from the request parameters
        // Find and delete the todo by ID, ensuring it belongs to the authenticated user
        const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
        if (!todo) {
            return res.status(404).json({
                message: 'Todo not found'
            });
        }
        // Respond with success message
        return res.status(200).json({
            success: true,
            message: "Todo successfully deleted"
        });
    } catch (error) {
        // Handle errors during deletion
        return res.status(500).json({
            message: 'Error deleting todo',
            error: error.message
        });
    }
};

/**
 * Updates a specific todo by ID for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const updateTodo = async (req, res) => {
    const { id } = req.params; // Extract the todo ID from the request parameters
    // Prepare the update data from the request body
    const updateData = {
        task: req.body.task,
        notes: req.body.notes ? DOMPurify.sanitize(req.body.notes, purifyConfig) : undefined,
        priority: req.body.priority,
        completed: req.body.completed,
        deadlineDate: req.body.deadlineDate
    };

    // Remove undefined fields from the update data
    Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
    );

    try {
        // Find and update the todo, ensuring it belongs to the authenticated user
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updateData,
            { new: true, runValidators: true } // Return the updated todo and run validators
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        // Respond with the updated todo
        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            data: updatedTodo // Respond with the updated todo data
        });
    } catch (error) {
        // Handle errors during updating
        res.status(500).json({
            message: 'Error updating todo',   
            error: error.message
        });
    }
};

// Export the controller functions for use in routes
module.exports = {
    getTodos,
    addTodo,
    getTodo,
    deleteTodo,
    updateTodo
};