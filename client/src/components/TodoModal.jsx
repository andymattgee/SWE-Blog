import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import '../styles/todo-quill.css';

// Quill modules and formats configuration
const quillModules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': ['', 'center', 'right', 'justify'] }],
        ['clean']
    ],
    clipboard: {
        matchVisual: false
    }
};

const quillFormats = [
    'bold', 'italic', 'underline',
    'list', 'bullet', 'ordered',
    'align'
];

// Modal component for creating and editing todos
const TodoModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
        // State to hold form data
    const [formData, setFormData] = useState({
        task: '',
        notes: '',
        priority: 'low',
        deadlineDate: ''
    });

    // Effect to handle initialData changes
    useEffect(() => {
        if (initialData && isOpen) {
            console.log('Received initial data:', initialData);
            
            // Format the date properly
            let formattedDate = '';
            if (initialData.deadlineDate) {
                const date = new Date(initialData.deadlineDate);
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toISOString().split('T')[0];
                }
            }

            setFormData({
                task: initialData.task || '',
                notes: initialData.notes || '',
                priority: initialData.priority || 'low',
                deadlineDate: formattedDate
            });
        } else if (!isOpen) {
            // Reset form when modal closes
            setFormData({
                task: '',
                notes: '',
                priority: 'low',
                deadlineDate: ''
            });
        }
    }, [initialData, isOpen]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        
        // Ensure all fields are properly formatted
        const submissionData = {
            task: formData.task.trim(),
            notes: formData.notes || '',
            priority: formData.priority || 'low',
            deadlineDate: formData.deadlineDate,
            completed: initialData ? initialData.completed : false
        };

        console.log('Submitting form data:', submissionData);
        onSubmit(submissionData); // Call the onSubmit function passed as a prop with the form data
        onClose(); // Close the modal after submission
    };

    // If the modal is not open, return null to render nothing
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? 'Edit Task' : 'Create New Task'} {/* Conditional title based on editing or creating */}
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Task input field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Task</label>
                        <input
                            type="text"
                            value={formData.task}
                            onChange={(e) => setFormData({...formData, task: e.target.value})} // Update task in state
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    {/* Notes input field with Quill rich text editor */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <ReactQuill
                            theme="snow"
                            value={formData.notes}
                            onChange={(content) => setFormData({...formData, notes: content})} // Update notes in state
                            modules={quillModules}
                            formats={quillFormats}
                            className="todo-quill"
                        />
                    </div>
                    {/* Priority selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})} // Update priority in state
                            className="w-full p-2 border rounded"
                        >
                            <option value="low">Low</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    {/* Deadline date input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Deadline Date</label>
                        <input
                            type="date"
                            value={formData.deadlineDate}
                            onChange={(e) => setFormData({...formData, deadlineDate: e.target.value})} // Update deadline date in state
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    {/* Action buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose} // Close the modal without submitting
                            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit" // Submit the form
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {initialData ? 'Update' : 'Create'} {/* Conditional button text based on editing or creating */}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TodoModal; 