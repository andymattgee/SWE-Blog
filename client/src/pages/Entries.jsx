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
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import fallImage from '../../public/images/fall-bg.jpg';
import beachIMG from '../../public/images/beach.jpg';
import mountains from '../../public/images/mountains.jpg';


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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-blue-100 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-center flex-1">{entry.title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 mt-[-10px] mr-[-10px]"
                    >
                        ✕
                    </button>
                </div>
                {/* Date Display */}
                <p className="text-center text-gray-600 mb-4">
                    {new Date(entry.createdAt).toLocaleDateString()}
                </p>
                
                {/* Modal Content */}
                {isEditing ? (
                    // Edit Form
                    <form onSubmit={onEdit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Professional Content</label>
                            <textarea
                                value={editForm.professionalContent}
                                onChange={(e) => setEditForm({...editForm, professionalContent: e.target.value})}
                                rows={5}
                                className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Personal Content</label>
                            <textarea
                                value={editForm.personalContent}
                                onChange={(e) => setEditForm({...editForm, personalContent: e.target.value})}
                                rows={5}
                                className="mt-1 block w-full bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    // View Mode
                    <>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-center mb-2">Professional</h3>
                            <div className="border bg-white p-4 rounded-md">
                                <p className="text-gray-700">{entry.professionalContent}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-center mb-2">Personal</h3>
                            <div className="border bg-white p-4 rounded-md">
                                <p className="text-gray-700">{entry.personalContent}</p>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent event bubbling
                                    onDelete(entry._id);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this entry? This action cannot be undone.</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Delete
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
            await axios.put(`http://localhost:3333/entries/${selectedEntry._id}`, editForm, {
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
                    <div className="p-[2px] rounded-lg bg-black">
                        <article className="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden dark:bg-amber-50 hover:bg-cyan-600 transition duration-300 ease-in-out transform hover:scale-105 h-64">
                            <div className="max-w-full">
                                {mountains && <img src={mountains} alt="mountains" className="max-w-full h-auto" />}
                            </div>
                            <div className="flex flex-col gap-1 mt-4 px-4">
                                <h2 className="text-base font-semibold text-gray-800 dark:text-black truncate">{title}</h2>
                            </div>
                            <div className="mt-2 p-2 flex justify-center">
                                <h3 className="text-sm text-gray-600 dark:text-gray-700">{formattedDate}</h3>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        );
    }).reverse();

    return (
        <div style={{
            background: 'linear-gradient(to bottom, white, #3498DB, #2C3E50)',
            height: '100%',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <NavBar />
            <div className="px-6 flex flex-col items-center">
                <br />
                {/* <h1 className="text-4xl font-bold text-center mb-5"> Blog Entries</h1> */}

                {/* <h5 className="text-left mb-2">Click entries to view details</h5> */}
                
                {/* Button Container */}
                <div className="flex justify-between w-full mb-4"> {/* Flex container for buttons */}
                    {/* View Toggle Button */}
                    <button
                        onClick={() => setIsListView(!isListView)}
                        className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-700 hover:to-green-700 border border-grey-500 text-white py-2 px-4 rounded"
                    >
                        {isListView ? 'Change to Grid View' : 'Change to List View'}
                    </button>

                    {/* New Entry Button */}
                    <button
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm w-1/6 px-3 py-1.5 text-center"
                        onClick={handleNewEntry}>
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
                                    <li key={entry._id} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white shadow-lg hover:bg-gray-100 hover:border-gray-400 transition duration-300 cursor-pointer" onClick={() => getEntry(entry._id)}>
                                        <div className="flex justify-between w-full">
                                            <span className="text-lg font-bold">{entry.title}</span>
                                            <span className="text-sm text-gray-600 block">{new Date(entry.createdAt).toLocaleDateString()}</span>
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

