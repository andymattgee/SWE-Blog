import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';
import EntryImage from './EntryImage';
import { quillModules, quillFormats } from '../utils/quillConfig';

/**
 * EditEntryModal Component
 * Modal component for editing an existing blog entry
 * 
 * @param {Object} props
 * @param {Object} props.entry - The entry object to edit
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onUpdate - Function to handle update submission
 * @returns {JSX.Element} The modal component
 */
const EditEntryModal = ({ entry, isOpen, onClose, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [professionalContent, setProfessionalContent] = useState('');
    const [personalContent, setPersonalContent] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);

    // Update state when entry changes
    useEffect(() => {
        if (entry) {
            setTitle(entry.title);
            setProfessionalContent(entry.professionalContent);
            setPersonalContent(entry.personalContent || '');
            // Set image preview with proper format for existing S3 images
            setImagePreview(entry.image ? { url: entry.image, isLocal: false } : null);
            setImage(null); // Reset any previously selected file
        }
    }, [entry]);

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

        if (!title || !professionalContent) {
            toast.error('Title and professional content are required');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('professionalContent', professionalContent);
        formData.append('personalContent', personalContent);
        if (image) {
            formData.append('image', image);
        }

        try {
            await onUpdate(entry._id, formData);
            onClose();
        } catch (error) {
            console.error('Error updating entry:', error);
            toast.error('Failed to update entry');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 bg-opacity-90 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white border border-purple-500 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">Edit Entry</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center space-x-4 mb-4">
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="image"
                                className="px-4 py-2 bg-gray-800 text-white rounded cursor-pointer hover:bg-gray-700 border border-gray-700"
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
                        <label className="block text-sm font-medium text-gray-300 mb-1">Professional Content</label>
                        <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                            <ReactQuill
                                value={professionalContent}
                                onChange={setProfessionalContent}
                                className="todo-quill dark-theme absolute inset-0"
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Personal Content</label>
                        <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                            <ReactQuill
                                value={personalContent}
                                onChange={setPersonalContent}
                                className="todo-quill dark-theme absolute inset-0"
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
                            className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEntryModal; 