import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import EntryImage from './EntryImage';

// Quill modules and formats configuration
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': ['', 'center', 'right', 'justify'] }],
        ['clean']
    ],
    clipboard: {
        matchVisual: false
    },
    keyboard: {
        bindings: {
            tab: {
                key: 9,
                handler: function () {
                    return true; // Let default tab behavior happen
                }
            }
        }
    }
};

const quillFormats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet', 'ordered',
    'align',
    'indent',
    'direction'
];

/**
 * NewEntryModal Component for creating new entries
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @returns {JSX.Element} The modal component
 */
const NewEntryModal = ({ theme = 'dark', isOpen, onClose, onSubmit }) => { // Add theme prop, default to dark
    const [imagePreview, setImagePreview] = useState(null);
    const [professionalContent, setProfessionalContent] = useState('');
    const [personalContent, setPersonalContent] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }

            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview({ url: reader.result, isLocal: true });
            };
            reader.onerror = () => {
                toast.error('Failed to read image file');
                setImage(null);
                setImagePreview(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            title: e.target.title.value,
            professionalContent: professionalContent,
            personalContent: personalContent,
            image: image
        };

        // Validate required fields
        if (!formData.title || !formData.professionalContent) {
            toast.error('Title and professional content are required');
            return;
        }

        try {
            await onSubmit(formData);
            // Reset form
            setImagePreview(null);
            setImage(null);
            setProfessionalContent('');
            setPersonalContent('');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to create entry');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className={`rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl ${
                theme === 'light'
                ? 'bg-white text-gray-900 border border-gray-300'
                : 'bg-gray-900 bg-opacity-95 text-white border border-purple-500'
            }`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-purple-700' : 'text-blue-400'}`}>Create New Entry</h2>
                    <button
                        onClick={onClose}
                        className={`text-xl font-bold ${theme === 'light' ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={`w-full p-2 rounded border focus:ring-blue-500 focus:border-blue-500 ${
                                theme === 'light'
                                ? 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                                : 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                            }`}
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center space-x-4 mb-4">
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="image"
                                className={`px-4 py-2 rounded cursor-pointer border ${
                                    theme === 'light'
                                    ? 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                                    : 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700'
                                }`}
                            >
                                Choose Image
                            </label>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setImage(null);
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        {imagePreview && (
                            <div className="mt-2 mb-4">
                                <EntryImage imagePath={imagePreview} />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Professional Content</label>
                        <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                            <ReactQuill
                                value={professionalContent}
                                onChange={setProfessionalContent}
                                className={`todo-quill absolute inset-0 ${theme === 'dark' ? 'dark-theme' : ''}`}
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Personal Content</label>
                        <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                            <ReactQuill
                                value={personalContent}
                                onChange={setPersonalContent}
                                className={`todo-quill absolute inset-0 ${theme === 'dark' ? 'dark-theme' : ''}`}
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-lg ${
                                theme === 'light'
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                : 'bg-gray-600 text-white hover:bg-gray-700'
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded-lg ${
                                theme === 'light'
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            Create Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewEntryModal; 