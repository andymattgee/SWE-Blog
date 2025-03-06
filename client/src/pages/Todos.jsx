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
 * The component also renders a button to create a new todo, which navigates to
 * the CreateTodo page.
 */

const Todos = () => {
    const [todos, setTodos] = useState({
        today: [],
        overdue: [],
        pending: [],
        completed: []
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [activeSection, setActiveSection] = useState('today');
    const [showCompleted, setShowCompleted] = useState(false);

    /**
     * Retrieves the list of todos from the database and sets the state of the
     * todos, completedTodos and incompleteTodos arrays. It also calls
     * getTodos() on the first render to populate the list of todos.
     */
    const getTodos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3333/api/todos', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            setTodos(response.data.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (editingTodo) {
                await axios.put(
                    `http://localhost:3333/api/todos/${editingTodo._id}`,
                    formData,
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                await axios.post(
                    'http://localhost:3333/api/todos',
                    formData,
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
            getTodos();
            setEditingTodo(null);
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3333/api/todos/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            getTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleToggleComplete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const todo = [...todos.today, ...todos.overdue, ...todos.pending, ...todos.completed]
                .find(t => t._id === id);
            
            await axios.put(
                `http://localhost:3333/api/todos/${id}`,
                { completed: !todo.completed },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            getTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Tasks</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => setActiveSection('today')}
                            className={`px-4 py-2 rounded-lg ${
                                activeSection === 'today'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white'
                            }`}
                        >
                            Today ({todos.today.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('overdue')}
                            className={`px-4 py-2 rounded-lg ${
                                activeSection === 'overdue'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white'
                            }`}
                        >
                            Overdue ({todos.overdue.length})
                        </button>
                        <button
                            onClick={() => setActiveSection('pending')}
                            className={`px-4 py-2 rounded-lg ${
                                activeSection === 'pending'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white'
                            }`}
                        >
                            Pending ({todos.pending.length})
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {todos[activeSection].map(todo => (
                        <TodoItem
                            key={todo._id}
                            todo={todo}
                            onEdit={(todo) => {
                                setEditingTodo(todo);
                                setIsModalOpen(true);
                            }}
                            onDelete={handleDelete}
                            onToggleComplete={handleToggleComplete}
                        />
                    ))}
                </div>

                {todos.completed.length > 0 && (
                    <div className="mt-8">
                        <button
                            onClick={() => setShowCompleted(!showCompleted)}
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
                                        onEdit={(todo) => {
                                            setEditingTodo(todo);
                                            setIsModalOpen(true);
                                        }}
                                        onDelete={handleDelete}
                                        onToggleComplete={handleToggleComplete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <TodoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTodo(null);
                }}
                onSubmit={handleSubmit}
                initialData={editingTodo}
            />
        </div>
    );
};

export default Todos;
