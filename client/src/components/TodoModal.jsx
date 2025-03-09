import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/todo-quill.css';

const TodoModal = ({ isOpen, onClose, onSubmit, editingTodo }) => {
    // Initialize form data state with proper date formatting
    const getInitialFormData = () => ({
        task: '',
        notes: '',
        priority: 'low',
        deadlineDate: new Date().toISOString().split('T')[0],
        _id: null
    });

    const [formData, setFormData] = useState(getInitialFormData());

    // Quill editor configuration
    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['clean']
        ]
    };

    const quillFormats = [
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet'
    ];

    // Update form data when editing a todo
    useEffect(() => {
        if (editingTodo) {
            // Ensure we have a valid date
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
            // Reset form when creating a new todo
            setFormData(getInitialFormData());
        }
    }, [editingTodo, isOpen]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ensure we have a valid date
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

    // Handle modal close
    const handleClose = () => {
        setFormData(getInitialFormData());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 bg-opacity-90 p-6 rounded-lg w-96 text-white border border-purple-500 shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-blue-400">
                    {editingTodo ? 'Edit Task' : 'Create New Task'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Task</label>
                        <input
                            type="text"
                            value={formData.task}
                            onChange={(e) => setFormData({...formData, task: e.target.value})}
                            className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                        <ReactQuill
                            theme="snow"
                            value={formData.notes}
                            onChange={(content) => setFormData({...formData, notes: content})}
                            modules={quillModules}
                            formats={quillFormats}
                            className="todo-quill dark-theme"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Deadline Date</label>
                        <input
                            type="date"
                            value={formData.deadlineDate}
                            onChange={(e) => setFormData({...formData, deadlineDate: e.target.value})}
                            className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
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