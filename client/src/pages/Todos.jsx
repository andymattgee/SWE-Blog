import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/navbar';
import TodoItem from '../components/TodoItem';
import TodoModal from '../components/TodoModal';

/**
 * The Todos component is the main page of the application that displays the user's
 * to-do list. It retrieves the list of todos from the database and displays them
 * in two columns - one for completed and one for incomplete todos.
 *
 * The component also renders a button to create a new todo, which opens a modal
 * for adding or editing tasks.
 */

const Todos = () => {
    // State to hold todos categorized by their status
    const [todos, setTodos] = useState({
        today: [],
        pending: [],
        overdue: [],
        completed: []
    });
    
    // State to control the visibility of the modal for adding/editing todos
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State to hold the todo currently being edited
    const [editingTodo, setEditingTodo] = useState(null);
    
    // State to track which section of todos is currently active (today, pending, overdue)
    const [activeSection, setActiveSection] = useState('today');
    
    // State to control the visibility of completed tasks
    const [showCompleted, setShowCompleted] = useState(false);
    
    // State to manage delete confirmation dialog
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    // State to hold the ID of the todo to be deleted
    const [todoToDelete, setTodoToDelete] = useState(null);

    /**
     * Retrieves the list of todos from the database and sets the state of the
     * todos. This function is called on the first render to populate the list of todos.
     */
    const getTodos = async () => {
        try {
            // Retrieve the authentication token from local storage
            const token = localStorage.getItem('token');
            
            // Make a GET request to fetch todos from the API
            const response = await axios.get('http://localhost:3333/api/todos', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                }
            });
            
            // Sort todos by creation date (newest first)
            const sortedData = Object.keys(response.data.data).reduce((acc, key) => {
                acc[key] = response.data.data[key].sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                return acc;
            }, {});
            
            // Update the state with the sorted todos
            setTodos(sortedData);
        } catch (error) {
            console.error('Error fetching todos:', error); // Log any errors that occur during the fetch
        }
    };

    // useEffect hook to call getTodos when the component mounts
    useEffect(() => {
        getTodos();
    }, []);

    /**
     * Handles the submission of the todo form. It either creates a new todo or updates
     * an existing one based on whether editingTodo is set.
     * @param {Object} formData - The data from the form submission
     */
    const handleSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token for authentication
            // Ensure all fields are properly formatted
            const cleanedData = {
                task: formData.task.trim(),
                notes: formData.notes || '',
                priority: formData.priority || 'low',
                deadlineDate: formData.deadlineDate || new Date().toISOString(),
                completed: editingTodo ? editingTodo.completed : false
            };
            
            console.log('Submitting data:', cleanedData);
            
            if (editingTodo) {
                // If editing an existing todo, send a PUT request
                await axios.put(
                    `http://localhost:3333/api/todos/${editingTodo._id}`,
                    cleanedData,
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                // If creating a new todo, send a POST request
                await axios.post(
                    'http://localhost:3333/api/todos',
                    cleanedData,
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
            getTodos(); // Refresh the todo list after submission
            setEditingTodo(null); // Reset editingTodo state
        } catch (error) {
            console.error('Error saving todo:', error); // Log any errors that occur during save
        }
    };

    /**
     * Prepares to confirm the deletion of a todo by setting the ID of the todo to be deleted
     * and showing the confirmation dialog.
     * @param {string} id - The ID of the todo to delete
     */
    const confirmDelete = (id) => {
        setTodoToDelete(id); // Set the ID of the todo to delete
        setShowDeleteConfirm(true); // Show the confirmation dialog
    };

    /**
     * Handles the deletion of a todo. Sends a DELETE request to the API and refreshes the todo list.
     */
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token for authentication
            await axios.delete(`http://localhost:3333/api/todos/${todoToDelete}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            setShowDeleteConfirm(false); // Hide the confirmation dialog
            setTodoToDelete(null); // Reset the todo to delete
            getTodos(); // Refresh the todo list
        } catch (error) {
            console.error('Error deleting todo:', error); // Log any errors that occur during deletion
        }
    };

    /**
     * Toggles the completion status of a todo. Sends a PUT request to update the todo's status.
     * @param {string} id - The ID of the todo to toggle
     */
    const handleToggleComplete = async (id) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token for authentication
            const todo = [...todos.today, ...todos.overdue, ...todos.pending, ...todos.completed]
                .find(t => t._id === id); // Find the todo by ID
            
            await axios.put(
                `http://localhost:3333/api/todos/${id}`,
                { completed: !todo.completed }, // Toggle the completed status
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            getTodos(); // Refresh the todo list after toggling
        } catch (error) {
            console.error('Error updating todo:', error); // Log any errors that occur during update
        }
    };

    /**
     * Handles editing a todo by preparing the data and opening the modal
     * @param {Object} todo - The todo to be edited
     */
    const handleEdit = (todo) => {
        // Log the current section and todo data
        console.log('Current section:', activeSection);
        console.log('Raw todo data:', todo);

        // Create a clean copy with all required fields
        const todoData = {
            _id: todo._id,
            task: todo.task,
            notes: todo.notes,
            priority: todo.priority,
            deadlineDate: todo.deadlineDate,
            completed: todo.completed
        };

        console.log('Clean todo data:', todoData);
        setEditingTodo(todoData);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar /> {/* Render the navigation bar */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-center flex-1">Task List</h1> {/* Centered title */}
                    <button
                        onClick={() => {
                            setEditingTodo(null); // Reset editing state for new todo
                            setIsModalOpen(true); // Open the modal for adding a new todo
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex justify-center mb-4">
                        {/* Buttons to switch between different sections of todos with increased width */}
                        <button
                            onClick={() => setActiveSection('today')}
                            className={`px-20 py-3 ${
                                activeSection === 'today'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white'
                            } border-r border-gray-200 rounded-l-lg`} // Increased padding for wider button
                        >
                            Today ({todos.today.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('pending')}
                            className={`px-20 py-3 ${
                                activeSection === 'pending'
                                    ? 'bg-yellow-500 text-white' // Change to yellow when selected
                                    : 'bg-white'
                            } border-r border-gray-200`} // Increased padding for wider button
                        >
                            Pending ({todos.pending.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('overdue')}
                            className={`px-20 py-3 ${
                                activeSection === 'overdue'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white'
                            } rounded-r-lg`} // Increased padding for wider button
                        >
                            Overdue ({todos.overdue.length})
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {/* Render the list of todos based on the active section */}
                    {todos[activeSection].map(todo => (
                        <TodoItem
                            key={todo._id}
                            todo={todo}
                            onEdit={handleEdit}
                            onDelete={confirmDelete} // Pass the confirmDelete function
                            onToggleComplete={handleToggleComplete} // Pass the toggle function
                        />
                    ))}
                </div>

                {/* Render completed tasks section if there are any */}
                {todos.completed.length > 0 && (
                    <div className="mt-8">
                        <button
                            onClick={() => setShowCompleted(!showCompleted)} // Toggle visibility of completed tasks
                            className="flex items-center gap-2 text-gray-600"
                        >
                            <span className="text-lg">
                                {showCompleted ? '▼' : '▶'}
                            </span>
                            Completed Tasks ({todos.completed.length})
                        </button>
                        {showCompleted && (
                            <div className="mt-4 space-y-2">
                                {todos.completed.map(todo => (
                                    <TodoItem
                                        key={todo._id}
                                        todo={todo}
                                        onEdit={handleEdit}
                                        onDelete={confirmDelete} // Pass the confirmDelete function
                                        onToggleComplete={handleToggleComplete} // Pass the toggle function
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal for adding/editing todos */}
            <TodoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false); // Close the modal
                    setEditingTodo(null); // Reset editing state
                }}
                onSubmit={handleSubmit} // Pass the handleSubmit function
                initialData={editingTodo} // Pass the current todo data for editing
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6">Are you sure you want to delete this task?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false); // Close the confirmation dialog
                                    setTodoToDelete(null); // Reset the todo to delete
                                }}
                                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete} // Call the handleDelete function
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Todos;
