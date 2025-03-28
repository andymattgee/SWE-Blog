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
import 'react-quill/dist/quill.snow.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsPlusLg } from 'react-icons/bs';
import '../styles/todo-quill.css';
import '../styles/quill-viewer.css';
import Footer from '../components/Footer';
import ViewEntryModal from '../components/ViewEntryModal';
import NewEntryModal from '../components/NewEntryModal';
import EditEntryModal from '../components/EditEntryModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ExitConfirmationModal from '../components/ExitConfirmationModal';
import EntryCard from '../components/EntryCard';

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

const Entries = () => {
    // State management
    const [entries, setEntries] = useState([]); // List of all entries
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

    /**
     * Maps entries to grid view cards
     * 
     * @returns {Array<JSX.Element>} Array of entry cards
     */
    const gridItems = entries.map((entry) => (
        <EntryCard
            key={entry._id}
            entry={entry}
            onClick={handleEntryClick}
        />
    ));

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
