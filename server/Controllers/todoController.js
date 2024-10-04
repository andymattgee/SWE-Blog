//create logic for todo that will include get,post,put,delete

const { get } = require('http');
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

const getTodo = async (req, res) => {
    console.log('enter getTodo block');
    const { id } = req.params;
    try {
        const todo = await Todo.findOne({_id: id, user: req.user._id});
        if(!todo){
            return res.status(404).json({message: `Todo ${id} not found`})
        }
        res.status(200).json([todo]);
    } catch (error) {
        res.status(500).json({message: 'Error fetching todo'})
    }
};

const deleteTodo = async (req,res) =>{
    try {
        const {id} = req.params;
        const results = await Todo.findOneAndDelete({_id:id, user: req.user._id});
        if(!results){
            return res.status(400).json({
                message:'Todo not found in DB, check ID/parameters'
            })
        }
        return res.status(200).json({
            success: true,
            message: "Todo successfullly deleted!"
        })
    } catch (error) {
        return res.status(500).json({
            message:'Error deleting todo in DB',
            errorMessage: error.message
        })
    }
};

const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, notes, priority, status } = req.body;

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { title, notes, priority, status },
            { new: true, runValidators: true }
        );
        
        if (!updatedTodo) {
            return res.status(404).json({ message: `Todo ${id} not found` });
        }
        
        res.status(200).json({
            success: true,
            message: `${updatedTodo.title} updated successfully`,
            data: updatedTodo
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating todo in DB',   
            errorMessage: error.message
        });
    }
}

module.exports = {
    getTodos,
    addTodo,
    getTodo,
    deleteTodo,
    updateTodo
}