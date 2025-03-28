// create todo routes that will include post,get,put,delete

// Import necessary modules
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new router instance
const auth = require('../Middleware/auth'); // Import authentication middleware
const todoController = require('../Controllers/todoController'); // Import todo controller

// Define routes for todo operations
// Fetch all todos for the authenticated user
router.get('/', auth, todoController.getTodos); // 
// Add a new todo for the authenticated user
router.post('/', auth, todoController.addTodo); // 
// Fetch a specific todo by ID for the authenticated user
router.get('/:id', auth, todoController.getTodo); // 
// Delete a specific todo by ID for the authenticated user
router.delete('/:id', auth, todoController.deleteTodo); 
// Update a specific todo by ID for the authenticated user
router.put('/:id', auth, todoController.updateTodo); 

// Export the router for use in the main application
module.exports = router;