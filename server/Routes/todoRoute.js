// create todo routes that will include post,get,put,delete

const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const todoController  = require('../Controllers/todoController');

//currently get and post routes working, uncomment rest of routes once logic is added
router.get('/', auth, todoController.getTodos);
router.post('/', auth, todoController.addTodo);
// router.get('/:id', auth, todoController.getTodo);
// router.delete('/:id', auth, todoController.deleteTodo);
// router.put('/:id', auth, todoController.updateTodo);

module.exports = router