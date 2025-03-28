/**
 * Entries Component
 * 
 * A React component that displays a list of blog entries in grid view.
 * Provides functionality to view, create, edit, and delete entries through a modal interface.
 * 
 * Features:
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
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsPlusLg } from 'react-icons/bs';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import '../styles/todo-quill.css';
import '../styles/quill-viewer.css';
import Footer from '../components/Footer';
import ViewEntryModal from '../components/ViewEntryModal';
import EntryImage from '../components/EntryImage';
import NewEntryModal from '../components/NewEntryModal';
import EditEntryModal from '../components/EditEntryModal';

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

// Function to process Quill content for display
const processQuillContent = (content) => {
    if (!content) return '';

    // Simply return the content directly to preserve all HTML formatting
    // The dangerouslySetInnerHTML in the component will handle rendering it
    return content;
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
    const [selectedEntry, setSelectedEntry] = useState(null); // Currently selected entry for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [isEditing, setIsEditing] = useState(false); // Edit mode state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);

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

    // Effect to fetch entries
    useEffect(() => {
        fetchEntries();
    }, []);

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
                    <div className="bg-gray-900 border border-purple-500 rounded-lg shadow-lg overflow-hidden h-full transition duration-300 hover:bg-purple-900 hover:shadow-xl hover:shadow-gray-400/30 hover:border-gray-300 cursor-pointer">
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

    return (
        <div className="min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col">
            <Navbar />
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
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Bloggy Mc-Blog Face</h1>
                    <button
                        onClick={() => setIsNewEntryModalOpen(true)}
                        className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-200 flex items-center justify-center"
                        title="Create New Entry"
                    >
                        <BsPlusLg size={20} />
                    </button>
                </div>

                {entries.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        <p className="text-xl">No entries yet. Create your first entry!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridItems}
                    </div>
                )}
            </div>

            {/* New Entry Modal */}
            {isNewEntryModalOpen && (
                <NewEntryModal
                    isOpen={isNewEntryModalOpen}
                    onClose={() => setIsNewEntryModalOpen(false)}
                    onSubmit={handleAddEntry}
                />
            )}

            {/* View/Edit Modal */}
            {isModalOpen && !isEditing && (
                <ViewEntryModal
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
                <EditEntryModal
                    entry={selectedEntry}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setIsEditing(false);
                    }}
                    onUpdate={handleUpdateEntry}
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <DeleteConfirmationModal
                    onConfirm={() => handleDelete(entryToDelete)}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
            <Footer />
        </div>
    );
}

export default Entries;
