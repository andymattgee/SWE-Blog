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
import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import fallImage from '../../public/images/fall-bg.jpg';
import beachIMG from '../../public/images/beach.jpg';
import mountains from '../../public/images/mountains.jpg';
import { BsGrid3X3Gap, BsListUl } from 'react-icons/bs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
 * Modal Component for displaying and editing entry details
 * 
 * @param {Object} props - Component props
 * @param {Object} props.entry - The entry to display
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onEdit - Function to handle edit submission
 * @param {Function} props.onDelete - Function to handle entry deletion
 * @param {boolean} props.isEditing - Whether the modal is in edit mode
 * @param {Function} props.setIsEditing - Function to toggle edit mode
 * @param {Object} props.editForm - The form data for editing
 * @param {Function} props.setEditForm - Function to update form data
 * @returns {JSX.Element} The modal component
 */
const Modal = ({ entry, onClose, onEdit, onDelete, isEditing, setIsEditing, editForm, setEditForm }) => {
    if (!entry) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 bg-opacity-90 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white border border-purple-500 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-center flex-1 text-blue-400">{entry.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 mt-[-10px] mr-[-10px]"
                    >
                        ✕
                    </button>
                </div>
                {/* Date Display */}
                <p className="text-center text-gray-400 mb-4">
                    {new Date(entry.createdAt).toLocaleDateString()}
                </p>
                
                {/* Modal Content */}
                {isEditing ? (
                    // Edit Form
                    <form onSubmit={onEdit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Professional Content</label>
                            <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                                <ReactQuill
                                    value={editForm.professionalContent}
                                    onChange={useCallback(
                                        debounce((content) => {
                                            console.log('Professional content HTML:', content);
                                            setEditForm(prev => ({...prev, professionalContent: content}));
                                        }, 300),
                                        []
                                    )}
                                    className="todo-quill dark-theme absolute inset-0"
                                    theme="snow"
                                    modules={quillModules}
                                    formats={quillFormats}
                                    style={{ height: '100%' }}
                                    preserveWhitespace={true}
                                />
                            </div>
                        </div>
                        <div className="mt-12">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Personal Content</label>
                            <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                                <ReactQuill
                                    value={editForm.personalContent}
                                    onChange={useCallback(
                                        debounce((content) => {
                                            console.log('Personal content HTML:', content);
                                            setEditForm(prev => ({...prev, personalContent: content}));
                                        }, 300),
                                        []
                                    )}
                                    className="todo-quill dark-theme absolute inset-0"
                                    theme="snow"
                                    modules={quillModules}
                                    formats={quillFormats}
                                    style={{ height: '100%' }}
                                    preserveWhitespace={true}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg border border-blue-400"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    // View Mode
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium text-blue-400 mb-2">Professional Content</h3>
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <div className="todo-quill dark-theme ql-editor" dangerouslySetInnerHTML={{ __html: processQuillContent(entry.professionalContent) }} />
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-blue-400 mb-2">Personal Content</h3>
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <div className="todo-quill dark-theme ql-editor" dangerouslySetInnerHTML={{ __html: processQuillContent(entry.personalContent) }} />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg border border-blue-400"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(entry._id)}
                                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg border border-red-400"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
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
const NewEntryModal = ({ onClose, onSubmit, onExitAttempt }) => {
    const [formData, setFormData] = useState({
        title: '',
        professionalContent: '',
        personalContent: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 bg-opacity-90 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white border border-purple-500 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-400">Create New Entry</h2>
                    <button
                        onClick={onExitAttempt}
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
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full p-2 rounded bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Professional Content</label>
                        <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                            <ReactQuill
                                value={formData.professionalContent}
                                onChange={(content) => setFormData({...formData, professionalContent: content})}
                                className="todo-quill dark-theme absolute inset-0"
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                                style={{ height: '100%' }}
                            />
                        </div>
                    </div>
                    <div className="mt-12">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Personal Content</label>
                        <div className="relative" style={{ height: '225px', marginBottom: '20px' }}>
                            <ReactQuill
                                value={formData.personalContent}
                                onChange={(content) => setFormData({...formData, personalContent: content})}
                                className="todo-quill dark-theme absolute inset-0"
                                theme="snow"
                                modules={quillModules}
                                formats={quillFormats}
                                style={{ height: '100%' }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onExitAttempt}
                            className="px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg border border-blue-400"
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
    const [editForm, setEditForm] = useState({
        title: '',
        professionalContent: '',
        personalContent: ''
    });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
    const [isExitConfirmationOpen, setIsExitConfirmationOpen] = useState(false);

    /**
     * Fetches all entries from the server and updates the entries state.
     * Handles authentication using the stored token.
     * 
     * @async
     * @throws {Error} If the API request fails
     */
    const getEntries = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:3333/entries', {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            setEntries(data.data);
        } catch (error) {
            console.error('Error fetching entries:', error);
            setError("Error fetching entries in FrontEnd. Please fix your shit");
        }
    };

    /**
     * Fetches a single entry by ID and opens the modal to display it.
     * 
     * @async
     * @param {string} id - The ID of the entry to fetch
     * @throws {Error} If the API request fails
     */
    const getEntry = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:3333/entries/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            setSelectedEntry(data[0]);
            // Log the HTML content received
            console.log('Received Professional Content:', data[0].professionalContent);
            console.log('Received Personal Content:', data[0].personalContent);
            
            // Initialize edit form with current entry data
            setEditForm({
                title: data[0].title,
                professionalContent: data[0].professionalContent,
                personalContent: data[0].personalContent
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching entry:', error);
            setError('Error fetching entry details');
        }
    };

    /**
     * Handles the submission of the edit form.
     * Updates the entry on the server and refreshes the data.
     * 
     * @async
     * @param {Event} e - The form submission event
     * @throws {Error} If the API request fails
     */
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // Ensure we're sending the raw HTML content
            const formData = {
                title: editForm.title,
                professionalContent: editForm.professionalContent || '',
                personalContent: editForm.personalContent || ''
            };
            await axios.put(`http://localhost:3333/entries/${selectedEntry._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsEditing(false);
            getEntries();
            getEntry(selectedEntry._id);
        } catch (error) {
            console.error('Error updating entry:', error);
            setError('Error updating entry');
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
            await axios.delete(`http://localhost:3333/entries/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsModalOpen(false);
            setIsDeleteModalOpen(false);
            getEntries();
        } catch (error) {
            console.error('Error deleting entry:', error);
            setError('Error deleting entry');
        }
    };

    /**
     * Handles the submission of a new entry.
     * Creates the entry on the server and refreshes the data.
     * 
     * @async
     * @param {Object} formData - The form data for the new entry
     * @throws {Error} If the API request fails
     */
    const handleNewEntrySubmit = async (formData) => {
        try {
            // Log the HTML content being sent
            console.log('Professional Content HTML:', formData.professionalContent);
            console.log('Personal Content HTML:', formData.personalContent);
            
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3333/entries', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsNewEntryModalOpen(false);
            getEntries();
        } catch (error) {
            console.error('Error creating entry:', error);
            setError('Error creating entry');
        }
    };

    // Effect to persist view mode preference and fetch entries
    useEffect(() => {
        localStorage.setItem('isListView', isListView.toString());
        getEntries();
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
    const newEntries = entries.map(({ _id, title, createdAt }) => {
        const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

        return (
            <div className="w-full flex items-center justify-center" key={_id}>
                <div onClick={() => getEntry(_id)} className="w-full px-2 mb-4 cursor-pointer">
                    <div className="p-[2px] rounded-lg bg-purple-600">
                        <article className="max-w-sm w-full bg-gray-900 rounded-lg shadow-lg overflow-hidden text-white hover:bg-purple-900 transition duration-300 ease-in-out transform hover:scale-105 h-64">
                            <div className="max-w-full">
                                {mountains && <img src={mountains} alt="mountains" className="max-w-full h-auto opacity-80" />}
                            </div>
                            <div className="flex flex-col gap-1 mt-4 px-4">
                                <h2 className="text-base font-semibold text-white truncate">{title}</h2>
                            </div>
                            <div className="mt-2 p-2 flex justify-center">
                                <h3 className="text-sm text-gray-300">{formattedDate}</h3>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        );
    }).reverse();

    return (
        <div className="min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
            <NavBar />
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
                        className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm w-1/6 px-3 py-1.5 text-center transition duration-300"
                        onClick={() => setIsNewEntryModalOpen(true)}>
                        Make New Entry
                    </button>
                </div>

                {/* Entries Container */}
                <div className={`${isListView ? "flex flex-col items-center w-full" : "grid grid-cols-5 gap-4"}`}>
                    {isListView ? (
                        // List View
                        <div className="w-full max-w-lg text-center">
                            <ul className="list-none w-full">
                                {entries.slice().reverse().map((entry) => (
                                    <li key={entry._id} className="mb-4 p-4 border border-purple-500 rounded-lg bg-gray-900 text-white shadow-lg hover:bg-purple-900 transition duration-300 cursor-pointer" onClick={() => getEntry(entry._id)}>
                                        <div className="flex justify-between w-full">
                                            <span className="text-lg font-bold">{entry.title}</span>
                                            <span className="text-sm text-gray-300 block">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        // Grid View
                        newEntries
                    )}
                </div>
            </div>

            {/* Entry Modal */}
            {isModalOpen && (
                <Modal
                    entry={selectedEntry}
                    onClose={() => setIsModalOpen(false)}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                        setEntryToDelete(id);
                        setIsDeleteModalOpen(true);
                    }}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    editForm={editForm}
                    setEditForm={setEditForm}
                />
            )}

            {/* New Entry Modal */}
            {isNewEntryModalOpen && (
                <NewEntryModal
                    onClose={() => setIsNewEntryModalOpen(false)}
                    onSubmit={handleNewEntrySubmit}
                    onExitAttempt={() => setIsExitConfirmationOpen(true)}
                />
            )}

            {/* Exit Confirmation Modal */}
            {isExitConfirmationOpen && (
                <ExitConfirmationModal
                    onConfirm={() => {
                        setIsExitConfirmationOpen(false);
                        setIsNewEntryModalOpen(false);
                    }}
                    onCancel={() => setIsExitConfirmationOpen(false)}
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
