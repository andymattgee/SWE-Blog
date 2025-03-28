import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/todo-quill.css';

/**
 * TodoModal component handles the creation and editing of todos.
 * It displays a modal with a form to input task details including task name,
 * notes, priority, and deadline date.
 *
 * Props:
 * - isOpen: Boolean to control modal visibility.
 * - onClose: Function to close the modal.
 * - onSubmit: Function to handle the submission of the form.
 * - editingTodo: Object containing the todo data to be edited, if applicable.
 */
const TodoModal = ({ isOpen, onClose, onSubmit, editingTodo }) => {
    /**
     * Initializes form data for the todo.
     * @returns {Object} Initial form data for task input.
     */
    const getInitialFormData = () => ({
        task: '',
        notes: '',
        priority: 'low',
        deadlineDate: new Date().toISOString().split('T')[0],
        _id: null
    });

    const [formData, setFormData] = useState(getInitialFormData());

    /**
     * Configuration for the Quill text editor toolbar.
     */
    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
        ]
    };

    /**
     * Formats supported by the Quill text editor.
     */
    const quillFormats = [
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet'
    ];

    /**
     * useEffect to handle the loading of editingTodo data when the modal opens.
     * It sets the form data based on the todo being edited.
     */
    useEffect(() => {
        if (editingTodo) {
            const deadlineDate = new Date(editingTodo.deadlineDate);
            const formattedDate = !isNaN(deadlineDate.getTime()) 
                ? deadlineDate.toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];

            setFormData({
                task: editingTodo.task || '',
                notes: editingTodo.notes || '',
                priority: editingTodo.priority || 'low',
                deadlineDate: formattedDate,
                _id: editingTodo._id
            });
        } else {
            setFormData(getInitialFormData());
        }
    }, [editingTodo, isOpen]);

    /**
     * Handles the form submission for creating or updating a todo.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        const deadlineDate = new Date(formData.deadlineDate);
        if (isNaN(deadlineDate.getTime())) {
            console.error('Invalid date');
            return;
        }

        const submissionData = {
            task: formData.task.trim(),
            notes: formData.notes || '',
            priority: formData.priority || 'low',
            deadlineDate: deadlineDate.toISOString(),
            _id: formData._id
        };

        onSubmit(submissionData);
        onClose();
    };

    /**
     * Handles closing the modal and resetting form data.
     */
    const handleClose = () => {
        setFormData(getInitialFormData());
        onClose();
    };

    // If the modal is not open, return null to prevent rendering.
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg w-96 text-white border border-purple-500 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-blue-400 flex justify-center">
                    {editingTodo ? 'Edit Task' : 'Create New Task'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Task Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Task
                        </label>
                        <input
                            type="text"
                            value={formData.task}
                            onChange={(e) => setFormData({...formData, task: e.target.value})}
                            className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Notes Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Notes
                        </label>
                        <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                            <ReactQuill
                                theme="snow"
                                value={formData.notes}
                                onChange={(content) => setFormData({...formData, notes: content})}
                                modules={quillModules}
                                formats={quillFormats}
                                className="todo-quill dark-theme absolute inset-0"
                                style={{ height: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Priority Selector */}
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">
                            Priority Level
                        </label>
                        <select
                            id="priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    {/* Date Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Deadline Date
                        </label>
                        <input
                            type="date"
                            value={formData.deadlineDate}
                            onChange={(e) => setFormData({...formData, deadlineDate: e.target.value})}
                            className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg border border-blue-400"
                        >
                            {editingTodo ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoModal;