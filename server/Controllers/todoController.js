//create logic for todo that will include get,post,put,delete

const { get } = require('http');
const Todo = require('../Models/todos');


const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user._id});
        
        // Get current date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter todos into categories
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

        return res.status(200).json({
            success: true,
            data: categorizedTodos
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Error fetching todos',
            error: error.message
        });
    }
};

const addTodo = async (req, res) => {
    try {
        const newTodo = {
            task: req.body.task,
            notes: req.body.notes,
            priority: req.body.priority,
            deadlineDate: req.body.deadlineDate,
            user: req.user._id
        };
        
        const todo = await Todo.create(newTodo);
        return res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: todo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error adding todo',
            error: error.message
        });
    }
};

const getTodo = async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findOne({_id: id, user: req.user._id});
        if(!todo){
            return res.status(404).json({message: 'Todo not found'});
        }
        res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching todo',
            error: error.message
        });
    }
};

const deleteTodo = async (req,res) => {
    try {
        const {id} = req.params;
        const todo = await Todo.findOneAndDelete({_id:id, user: req.user._id});
        if(!todo){
            return res.status(404).json({
                message:'Todo not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: "Todo successfully deleted"
        });
    } catch (error) {
        return res.status(500).json({
            message:'Error deleting todo',
            error: error.message
        });
    }
};

const updateTodo = async (req, res) => {
    const { id } = req.params;
    const updateData = {
        task: req.body.task,
        notes: req.body.notes,
        priority: req.body.priority,
        completed: req.body.completed,
        deadlineDate: req.body.deadlineDate
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
    );

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        
        res.status(200).json({
            success: true,
            message: 'Todo updated successfully',
            data: updatedTodo
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating todo',   
            error: error.message
        });
    }
};

module.exports = {
    getTodos,
    addTodo,
    getTodo,
    deleteTodo,
    updateTodo
};