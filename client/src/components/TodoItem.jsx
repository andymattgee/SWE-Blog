import React from 'react';
import { FaEdit, FaTrash, FaExclamationCircle } from 'react-icons/fa';

// Component for displaying a single todo item
const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }) => {
    // Function to format the date for display
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className={`flex items-center justify-between p-4 mb-2 bg-white rounded-lg shadow ${todo.completed ? 'opacity-75' : ''}`}>
            <div className="flex items-center flex-1">
                {/* Checkbox to mark the todo as completed */}
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleComplete(todo._id)} // Call onToggleComplete with the todo ID
                    className="h-5 w-5 rounded border-gray-300"
                />
                <div className="ml-4 flex-1">
                    {/* Display the task name with conditional styling for completed tasks */}
                    <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.task}
                    </h3>
                    {/* Display the due date */}
                    <div className="text-sm text-gray-500">
                        Due: {formatDate(todo.deadlineDate)}
                    </div>
                    {/* Display notes if they exist */}
                    {todo.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                            {todo.notes}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                {/* Edit button to trigger the edit action */}
                <button
                    onClick={() => onEdit(todo)} // Call onEdit with the todo object
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit task"
                >
                    <FaEdit size={20} />
                </button>
                {/* Delete button to trigger the delete action */}
                <button
                    onClick={() => onDelete(todo._id)} // Call onDelete with the todo ID
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete task"
                >
                    <FaTrash size={20} />
                </button>
                {/* Display a red "!" if the priority is high */}
                {todo.priority === 'high' && (
                    <FaExclamationCircle 
                        className="text-red-500" 
                        size={20}
                        title="High priority"
                    />
                )}
            </div>
        </div>
    );
};

export default TodoItem; 