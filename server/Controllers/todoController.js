//create logic for todo that will include get,post,put,delete

const Todo = require('../Models/todos');


const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user._id});
        //return 200 status with success message that contains success status, count of the array length, and the array itself
        return res.status(200).json({
            success: true,
            count: todos.length,
            data: todos
        })
        
    } catch (error) {
        //500 status error with error message
        return res.status(500).json({
            message: 'Error fetching todos (from DB in todoController)',
        })
    }
};

const addTodo = async (req, res) => {
    console.log('enter addTodo block');
    try {
        const newTodo = {
            title: req.body.title,
            notes: req.body.notes,
            priority: req.body.priority,
            status: req.body.status,
            date: req.body.date,
            user: req.user._id
        };
        const todo = await Todo.create(newTodo);
        return res.status(200).json({
            success: true,
            message: `${todo.title} created inside DB`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding todo to DB',
            errorMessage: error.message
        });
    }
};

module.exports = {
    getTodos,
    addTodo
}