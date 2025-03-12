/**
 * Entries Component
 * 
 * A React component that displays a list of blog entries in either grid or list view.
 * Provides functionality to view, create, edit, and delete entries through a modal interface.
 * 
 * Features:
 * - Toggle between grid and list view
 * - View entry details in a modal
 * - Edit entries inline
 * - Delete entries with confirmation
 * - Create new entries
 * - Responsive design
 * 
 * @component
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fallImage from '../../public/images/fall-bg.jpg';
import beachIMG from '../../public/images/beach.jpg';
import mountains from '../../public/images/mountains.jpg';
import { BsGrid3X3Gap, BsListUl, BsPlusLg } from 'react-icons/bs';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../styles/todo-quill.css';
import '../styles/quill-viewer.css';

/* Custom styles for Quill editor containers */
import '../styles/quill-container.css';

// Debounce helper function
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Quill modules and formats configuration
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
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
                handler: function() {
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

// Function to process Quill content for display
const processQuillContent = (content) => {
    if (!content) return '';
    
    // Simply return the content directly to preserve all HTML formatting
    // The dangerouslySetInnerHTML in the component will handle rendering it
    return content;
};

/**
 * EntryImage Component for rendering entry images with error handling
 * 
 * @param {Object} props - Component props
 * @param {string} props.imagePath - Path to the image
 * @returns {JSX.Element} The image element
 */
const EntryImage = ({ imagePath }) => {
    const [error, setError] = useState(false);

    if (!imagePath) {
        return <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-400">No image</span>
        </div>;
    }

    // Handle both S3 and local image paths
    const imageUrl = imagePath.startsWith('http') 
        ? imagePath 
        : `http://localhost:3333/uploads/images/${imagePath}`;

    if (error) {
        return <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-400">Failed to load image</span>
        </div>;
    }

    return (
        <img
            src={imageUrl}
            alt="Entry"
            className="w-full h-full object-cover rounded"
            onError={() => setError(true)}
        />
    );
};

/**
 * DeleteConfirmationModal Component for confirming entry deletion
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onConfirm - Function to handle deletion confirmation
 * @param {Function} props.onCancel - Function to handle cancellation
 * @returns {JSX.Element} The confirmation modal component
 */
const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 text-white border border-purple-500 shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Confirm Deletion</h2>
                <p className="mb-6 text-gray-300">Are you sure you want to delete this entry? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg border border-red-400"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * NewEntryModal Component for creating new entries
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Function} props.onExitAttempt - Function to handle exit attempts
 * @returns {JSX.Element} The modal component
 */
const NewEntryModal = ({ isOpen, onClose, onSubmit }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [professionalContent, setProfessionalContent] = useState('');
    const [personalContent, setPersonalContent] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
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
            <div className="bg-gray-900 bg-opacity-90 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white border border-purple-500 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">Create New Entry</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200"
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
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
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="max-h-48 rounded object-cover"
                                />
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
                            Create Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/**
 * ExitConfirmationModal Component for confirming modal exit with unsaved changes
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onConfirm - Function to handle confirmation
 * @param {Function} props.onCancel - Function to handle cancellation
 * @returns {JSX.Element} The confirmation modal component
 */
const ExitConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 bg-opacity-90 rounded-lg p-6 text-white border border-purple-500 shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Unsaved Changes</h2>
                <p className="mb-6 text-gray-300">Are you sure you want to exit? Any unsaved changes will be lost.</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                    >
                        Stay
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg border border-blue-400"
                    >
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
};

const Entries = () => {
    // Navigation hook for programmatic routing
    const navigate = useNavigate();
    
    // State management
    const [entries, setEntries] = useState([]); // List of all entries
    const [error, setError] = useState(null); // Error state for handling API errors
    const [isListView, setIsListView] = useState(() => {
        // Initialize view mode from localStorage or default to false
        const storedState = localStorage.getItem('isListView');
        return storedState === 'true';
    });
    const [selectedEntry, setSelectedEntry] = useState(null); // Currently selected entry for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [isEditing, setIsEditing] = useState(false); // Edit mode state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
    const [isExitConfirmationOpen, setIsExitConfirmationOpen] = useState(false);

    const fetchEntries = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3333/entries', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (!response.data.success) {
                throw new Error('Failed to fetch entries');
            }
            
            // Use data field from response
            setEntries(response.data.data || []);
        } catch (error) {
            console.error('Error fetching entries:', error);
            toast.error('Failed to load entries');
            setEntries([]);
        }
    }, []);

    /**
     * Fetches a single entry by ID
     */
    const getEntry = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3333/entries/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data.success || !response.data.data) {
                throw new Error('Entry not found');
            }

            // Set the selected entry and open the modal
            setSelectedEntry(response.data.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching entry:', error);
            toast.error('Failed to load entry');
        }
    };

    const handleUpdateEntry = async (id, formData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3333/entries/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update entry');
            }

            // Update the entries list with the updated entry
            setEntries(entries.map(entry => 
                entry._id === id ? response.data.data : entry
            ));

            // Close the modal and show success message
            setIsModalOpen(false);
            setIsEditing(false);
            toast.success('Entry updated successfully');
        } catch (error) {
            console.error('Error updating entry:', error);
            toast.error(error.message || 'Failed to update entry');
            throw error;
        }
    };

    /**
     * Handles the deletion of an entry.
     * Shows a confirmation modal before proceeding with deletion.
     * 
     * @async
     * @param {string} id - The ID of the entry to delete
     * @throws {Error} If the API request fails
     */
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3333/entries/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Entry deleted successfully!');
                fetchEntries(); // Refresh entries list to get correct sorting
                setIsModalOpen(false);
                setIsDeleteModalOpen(false); // Close the delete confirmation modal
            } else {
                throw new Error(response.data.message || 'Failed to delete entry');
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            toast.error(error.message || 'Failed to delete entry');
        }
    };

    /**
     * Handles adding a new entry
     */
    const handleAddEntry = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            
            // Create FormData object for file upload
            const data = new FormData();
            data.append('title', formData.title);
            data.append('professionalContent', formData.professionalContent);
            data.append('personalContent', formData.personalContent || '');
            data.append('date', new Date().toISOString());
            
            // Only append image if one was selected
            if (formData.image) {
                data.append('image', formData.image);
            }

            const response = await axios.post('http://localhost:3333/entries', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Entry created successfully!');
                setIsNewEntryModalOpen(false);
                fetchEntries(); // Refresh entries list to get correct sorting
            } else {
                throw new Error(response.data.message || 'Failed to create entry');
            }
        } catch (error) {
            console.error('Error adding entry:', error);
            toast.error(error.message || 'Failed to create entry');
        }
    };

    // Effect to persist view mode preference and fetch entries
    useEffect(() => {
        localStorage.setItem('isListView', isListView.toString());
        fetchEntries();
    }, [isListView]);

    /**
     * Navigates to the NewEntry page for creating a new entry.
     */
    const handleNewEntry = () => {
        navigate('/NewEntry');
    };

    /**
     * Navigates to the Home page.
     */
    const handleHomeButton = () => {
        navigate('/Home');
    };

    /**
     * Maps entries to grid view cards
     * 
     * @returns {Array<JSX.Element>} Array of entry cards
     */
    const gridItems = entries.map((entry) => {
        const formattedDate = new Date(entry.createdAt).toLocaleDateString();
        return (
            <div key={entry._id} className="col-span-1" onClick={() => handleEntryClick(entry)}>
                <div className="h-full">
                    <div className="bg-gray-900 border border-purple-500 rounded-lg shadow-lg overflow-hidden h-full transition duration-300 hover:bg-purple-900 hover:shadow-xl cursor-pointer">
                        <article className="h-full flex flex-col">
                            {entry.image ? (
                                <div className="h-40 overflow-hidden">
                                    <EntryImage imagePath={entry.image} />
                                </div>
                            ) : (
                                <div className="h-40 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                                    <span className="text-4xl text-white opacity-30">✍️</span>
                                </div>
                            )}
                            <div className="p-4 flex-grow flex flex-col">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-white truncate pr-2">{entry.title}</h3>
                                    <span className="text-xs text-gray-300 whitespace-nowrap">{formattedDate}</span>
                                </div>
                                <div className="text-gray-300 text-sm line-clamp-3 flex-grow">
                                    <div dangerouslySetInnerHTML={{ __html: processQuillContent(entry.professionalContent) }} />
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        );
    });

    const handleEntryClick = async (entry) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3333/entries/${entry._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data.success || !response.data.data) {
                throw new Error('Entry not found');
            }

            const entryData = response.data.data;
            setSelectedEntry(entryData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching entry:', error);
            toast.error('Failed to load entry');
        }
    };

    const entryList = entries.map((entry) => {
        return (
            <div
                key={entry._id}
                onClick={() => handleEntryClick(entry)}
                className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200 border border-purple-500/30 hover:border-purple-500/50"
            >
                <div className="flex flex-col h-full">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">{entry.title}</h3>
                    <div className="flex-grow">
                        <div className="mb-4">
                            <div className="todo-quill dark-theme ql-editor" dangerouslySetInnerHTML={{ __html: processQuillContent(entry.professionalContent) }} />
                        </div>
                        {entry.image && (
                            <div className="mb-4">
                                <EntryImage imagePath={entry.image} />
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-gray-400 mt-4">
                        {new Date(entry.date).toLocaleDateString()}
                    </div>
                </div>
            </div>
        );
    });

    const ViewModal = ({ entry, isOpen, onClose, onEdit, onDelete }) => {
        if (!entry) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                <div className="bg-gray-900 bg-opacity-90 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white border border-purple-500 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-blue-400">{entry.title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">✕</button>
                    </div>
                    <div className="space-y-6">
                        {entry.image && (
                            <div className="mb-6">
                                <EntryImage imagePath={entry.image} />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-medium text-blue-400 mb-2">Professional Content</h3>
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <div className="todo-quill dark-theme ql-editor" dangerouslySetInnerHTML={{ __html: processQuillContent(entry.professionalContent) }} />
                            </div>
                        </div>
                        {entry.personalContent && (
                            <div>
                                <h3 className="text-lg font-medium text-blue-400 mb-2">Personal Content</h3>
                                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <div className="todo-quill dark-theme ql-editor" dangerouslySetInnerHTML={{ __html: processQuillContent(entry.personalContent) }} />
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-400">
                                {new Date(entry.date).toLocaleDateString()}
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={onEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(entry._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const EditModal = ({ entry, isOpen, onClose }) => {
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
                setImagePreview(entry.image);
            }
        }, [entry]);

        const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
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
                await handleUpdateEntry(entry._id, formData);
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

    return (
        <div className="min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
            <NavBar />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="px-6 flex flex-col items-center">
                <br />
                
                {/* Button Container */}
                <div className="flex justify-between w-full mb-4">
                    {/* View Toggle Icon */}
                    <button
                        onClick={() => setIsListView(!isListView)}
                        className="bg-gray-900 hover:bg-purple-900 text-white p-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-110"
                        title={isListView ? 'Change to Grid View' : 'Change to List View'}
                    >
                        {isListView ? <BsGrid3X3Gap size={24} /> : <BsListUl size={24} />}
                    </button>

                    {/* New Entry Button */}
                    <button
                        className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm p-3 text-center transition duration-300"
                        onClick={() => setIsNewEntryModalOpen(true)}
                        title="Make New Entry">
                        <BsPlusLg size={20} />
                    </button>
                </div>

                {/* Entries Container */}
                {entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <i className="fas fa-book-open text-4xl mb-4 text-gray-400"></i>
                        <p className="text-gray-500">No entries found. Create your first entry!</p>
                    </div>
                ) : isListView ? (
                    // List View
                    <div className="w-full max-w-lg text-center">
                        <ul className="list-none w-full">
                            {entryList}
                        </ul>
                    </div>
                ) : (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridItems}
                    </div>
                )}
            </div>

            {/* Entry Modal */}
            {isModalOpen && !isEditing && (
                <ViewModal
                    entry={selectedEntry}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onEdit={() => setIsEditing(true)}
                    onDelete={(id) => {
                        setEntryToDelete(id);
                        setIsDeleteModalOpen(true);
                    }}
                />
            )}

            {/* Edit Modal */}
            {isModalOpen && isEditing && (
                <EditModal
                    entry={selectedEntry}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setIsEditing(false);
                    }}
                />
            )}

            {/* New Entry Modal */}
            {isNewEntryModalOpen && (
                <NewEntryModal
                    isOpen={isNewEntryModalOpen}
                    onClose={() => setIsNewEntryModalOpen(false)}
                    onSubmit={handleAddEntry}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onConfirm={() => handleDelete(entryToDelete)}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
}

export default Entries;
