import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import TodoItem from '../components/TodoItem';
import TodoModal from '../components/TodoModal';
import Footer from '../components/Footer';

// Set axios base URL for API requests
axios.defaults.baseURL = 'http://localhost:3333';

/**
 * The Todos component is the main page of the application that displays the user's
 * to-do list. It retrieves the list of todos from the database and displays them
 * in two columns - one for completed and one for incomplete todos.
 *
 * The component also renders a button to create a new todo, which opens a modal
 * for adding or editing tasks.
 */
const Todos = () => {
    const navigate = useNavigate();

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
     * Function to categorize a todo based on its deadline.
     * Determines whether the todo is overdue, due today, or pending.
     * @param {Object} todo - The todo item to categorize.
     * @returns {string} - The category of the todo.
     */
    const categorizeTodo = (todo) => {
        if (!todo || !todo.deadlineDate) return 'pending';

        if (todo.completed) return 'completed';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deadline = new Date(todo.deadlineDate);
        deadline.setHours(0, 0, 0, 0);

        const deadlineTime = deadline.getTime();
        const todayTime = today.getTime();

        if (deadlineTime < todayTime) return 'overdue';
        if (deadlineTime === todayTime) return 'today';
        return 'pending';
    };

    /**
     * Function to update the todos state after adding, editing, or deleting a todo.
     * @param {Object} newTodo - The new or updated todo item.
     * @param {boolean} isDelete - Flag indicating if the todo is being deleted.
     */
    const updateTodosState = (newTodo, isDelete = false) => {
        if (!newTodo) return;

        setTodos(prevTodos => {
            const newTodos = { ...prevTodos };  
            // Remove the todo from all sections first
            Object.keys(newTodos).forEach(section => {
                newTodos[section] = newTodos[section].filter(todo => todo._id !== newTodo._id);
            });

            // If not deleting, add the todo to its appropriate section
            if (!isDelete) {
                const section = categorizeTodo(newTodo);
                newTodos[section] = [...(newTodos[section] || []), newTodo];
            }

            return newTodos;
        });
    };

    /**
     * Function to fetch todos from the server and categorize them.
     * Handles deduplication of todos and updates the state accordingly.
     */
    const getTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/todos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Handle the nested data structure
            const fetchedTodos = response.data?.data || {};
            const categorizedTodos = {
                today: [],
                pending: [],
                overdue: [],
                completed: []
            };

            // Keep track of seen todo IDs to prevent duplicates
            const seenTodoIds = new Set();

            // Process each section's todos
            Object.keys(fetchedTodos).forEach(section => {
                if (Array.isArray(fetchedTodos[section])) {
                    fetchedTodos[section].forEach(todo => {
                        // Skip if we've already seen this todo
                        if (seenTodoIds.has(todo._id)) return;
                        seenTodoIds.add(todo._id);

                        if (todo && todo.deadlineDate) {
                            const category = categorizeTodo(todo);
                            categorizedTodos[category].push(todo);
                        } else {
                            categorizedTodos.pending.push(todo);
                        }
                    });
                }
            });

            // Sort todos by creation date in each category
            Object.keys(categorizedTodos).forEach(category => {
                categorizedTodos[category].sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
            });

            setTodos(categorizedTodos);
        } catch (error) {
            console.error('Error fetching todos:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    // Initial data fetch on component mount
    useEffect(() => {
        getTodos();
    }, [navigate]);

    /**
     * Function to handle form submission for adding or editing todos.
     * @param {Object} todoData - The data of the todo to be submitted.
     */
    const handleSubmit = async (todoData) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Ensure the date is properly formatted
            const formattedData = {
                ...todoData,
                deadlineDate: new Date(todoData.deadlineDate).toISOString()
            };

            let response;
            if (editingTodo && todoData._id) {
                // Update existing todo
                response = await axios.put(
                    `/api/todos/${todoData._id}`,
                    formattedData,
                    config
                );
            } else {
                // Create new todo - remove _id for new todos
                const { _id, ...newTodoData } = formattedData;
                response = await axios.post('/api/todos', newTodoData, config);
            }

            // Refresh the todos list after successful update
            await getTodos();
            // Close modal and reset editing state
            setEditingTodo(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving todo:', error);
            if (error.response?.status === 401) {
                console.log('User is not authenticated. Redirecting to login...');
                navigate('/login');
            }
        }
    };

    /**
     * Function to delete a todo by its ID.
     * @param {string} todoId - The ID of the todo to be deleted.
     */
    const handleDelete = async (todoId) => {
        if (!todoId) return;
        
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            await axios.delete(`/api/todos/${todoId}`, config);
            await getTodos(); // Refresh the list after deletion

            setShowDeleteConfirm(false);
            setTodoToDelete(null);
        } catch (error) {
            console.error('Error deleting todo:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    /**
     * Function to toggle the completion status of a todo.
     * @param {string} todoId - The ID of the todo to toggle completion.
     */
    const handleToggleComplete = async (todoId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const todo = Object.values(todos)
                .flat()
                .find(t => t._id === todoId);

            if (!todo) return;

            // Toggle the completed status
            const updatedTodo = {
                ...todo,
                completed: !todo.completed,
                // If marking as completed, set completion date
                completedAt: !todo.completed ? new Date().toISOString() : null
            };

            await axios.put(
                `/api/todos/${todoId}`,
                updatedTodo,
                config
            );

            // Refresh todos to update all sections
            await getTodos();
        } catch (error) {
            console.error('Error toggling todo completion:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    /**
     * Function to edit a todo.
     * @param {Object} todo - The todo item to edit.
     */
    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    /**
     * Function to confirm delete action.
     * @param {string} todoId - The ID of the todo to delete.
     */
    const confirmDelete = (todoId) => {
        if (!todoId) return;
        setTodoToDelete(todoId);
        setShowDeleteConfirm(true);
    };

    /**
     * Function to render todo items for a section.
     * @param {Array} sectionTodos - The todos to render.
     * @returns {JSX.Element[]} - The rendered todo items.
     */
    const renderTodoItems = (sectionTodos) => {
        return sectionTodos.map(todo => (
            <TodoItem
                key={`${todo._id}-${todo.updatedAt}`}
                todo={todo}
                onEdit={() => handleEdit(todo)}
                onDelete={() => confirmDelete(todo._id)}
                onToggleComplete={() => handleToggleComplete(todo._id)}
            />
        ));
    };

    return (
        <div className="min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-grow mb-8">
                <div className="flex flex-col items-center ">
                    <h1 className="text-4xl font-bold text-white mb-6">Task Manager</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveSection('today')}
                            className={`px-6 py-2 rounded-lg ${
                                activeSection === 'today'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            } transition-colors duration-200 min-w-[120px]`}
                        >
                            Today ({todos.today.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('pending')}
                            className={`px-6 py-2 rounded-lg ${
                                activeSection === 'pending'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            } transition-colors duration-200 min-w-[120px]`}
                        >
                            Pending ({todos.pending.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('overdue')}
                            className={`px-6 py-2 rounded-lg ${
                                activeSection === 'overdue'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            } transition-colors duration-200 min-w-[120px]`}
                        >
                            Overdue ({todos.overdue.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('completed')}
                            className={`px-6 py-2 rounded-lg ${
                                activeSection === 'completed'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            } transition-colors duration-200 min-w-[120px]`}
                        >
                            Completed ({todos.completed.length})
                        </button>
                    </div>
                </div>

                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        Add Task
                    </button>
                </div>

                <div className="space-y-4 mb-12">
                    {renderTodoItems(todos[activeSection] || [])}
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-900 p-6 rounded-lg text-white border border-red-500">
                            <h3 className="text-xl mb-4">Delete Task?</h3>
                            <p className="mb-4">Are you sure you want to delete this task?</p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setTodoToDelete(null);
                                    }}
                                    className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => todoToDelete && handleDelete(todoToDelete)}
                                    className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg border border-red-400"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <TodoModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingTodo(null);
                    }}
                    onSubmit={handleSubmit}
                    editingTodo={editingTodo}
                />
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default Todos;
