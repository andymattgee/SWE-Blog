import React from 'react';

const TodoItem = ({ todo, onEdit, onDelete, onToggleComplete }) => {
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
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleComplete(todo._id)}
                    className="h-5 w-5 rounded border-gray-300"
                />
                <div className="ml-4 flex-1">
                    <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.task}
                    </h3>
                    <div className="text-sm text-gray-500">
                        Due: {formatDate(todo.deadlineDate)}
                    </div>
                    {todo.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                            {todo.notes}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEdit(todo)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(todo._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                    Delete
                </button>
                {todo.priority === 'high' && (
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                )}
            </div>
        </div>
    );
};

export default TodoItem; 