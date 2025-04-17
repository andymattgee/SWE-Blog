/**
 * @file Entries.jsx
 * @description Displays a user's blog entries in a grid format.
 * Allows users to view, create, edit, delete, and summarize entries using modals.
 * Fetches entry data from the backend and manages various modal states.
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios"; // For making HTTP requests
import Navbar from '../components/Navbar'; // Navigation bar component
import Footer from '../components/Footer'; // Footer component
import EntryCard from '../components/EntryCard'; // Component to display individual entry previews
import ModalManager from '../components/ModalManager'; // Component to handle all modals (view, edit, delete, new, summary)
import AddEntryButton from '../components/AddEntryButton'; // Button to open the new entry modal
import { useUser } from '../context/UserContext'; // Hook to access user data from context
import { ToastContainer, toast } from 'react-toastify'; // For displaying notifications
import 'react-toastify/dist/ReactToastify.css'; // Styles for react-toastify
import 'react-quill/dist/quill.snow.css'; // Base styles for Quill editor
import '../styles/todo-quill.css'; // Custom Quill styles (if applicable)
import '../styles/quill-viewer.css'; // Styles for displaying Quill content read-only
import '../styles/quill-container.css'; // Custom styles for Quill editor containers

/**
 * @component Entries
 * @description The main component for displaying and managing user blog entries.
 * It handles fetching entries, managing modal states for various actions (view, edit, delete, create, summarize),
 * and rendering the entry grid and associated UI elements.
 * @returns {JSX.Element} The rendered Entries page component.
 */
const Entries = () => {
    // State for tracking the current theme (light/dark) based on HTML class
    const [theme, setTheme] = useState('light');
    // Access user data (like last entry date) from context
    const { userData } = useUser();

    // State for storing the list of entries fetched from the server
    const [entries, setEntries] = useState([]);
    // State for the currently selected entry (for viewing/editing)
    const [selectedEntry, setSelectedEntry] = useState(null);
    // State to control the visibility of the view/edit entry modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to track if the view modal is in edit mode
    const [isEditing, setIsEditing] = useState(false);
    // State to control the visibility of the delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // State to store the ID of the entry marked for deletion
    const [entryToDelete, setEntryToDelete] = useState(null);
    // State to control the visibility of the new entry modal
    const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
    // State to control the visibility of the summary modal
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

    /**
     * @function checkTheme
     * @description Detects the current theme by checking if the 'dark' class is present on the HTML element.
     * Updates the `theme` state accordingly.
     */
    const checkTheme = useCallback(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    // Effect to set the initial theme and observe changes to the HTML element's class attribute
    useEffect(() => {
        checkTheme(); // Initial theme check

        // Use MutationObserver to detect changes in the 'class' attribute of the <html> element
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Cleanup function to disconnect the observer when the component unmounts
        return () => observer.disconnect();
    }, [checkTheme]); // Dependency array includes checkTheme

    /**
     * @function fetchEntries
     * @description Fetches the list of entries for the logged-in user from the backend API.
     * Uses the authentication token from local storage.
     * Updates the `entries` state or shows an error toast on failure.
     */
    const fetchEntries = useCallback(async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve auth token
            if (!token) {
                toast.error("Authentication required. Please log in.");
                return; // Exit if no token
            }
            const response = await axios.get('http://localhost:5001/entries', {
                headers: {
                    Authorization: `Bearer ${token}` // Send token in Authorization header
                }
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch entries');
            }

            // Update state with fetched entries, defaulting to an empty array if data is missing
            setEntries(response.data.data || []);
        } catch (error) {
            console.error('Error fetching entries:', error);
            toast.error(`Failed to load entries: ${error.message}`);
            setEntries([]); // Reset entries on error
        }
    }, []); // Empty dependency array means this function is created once

    /**
     * @function handleUpdateEntry
     * @description Sends an update request to the backend API for a specific entry.
     * Handles multipart/form-data for potential image uploads.
     * Updates the `entries` state locally on success and closes the modal.
     * Shows success or error toasts.
     * @param {string} id - The ID of the entry to update.
     * @param {FormData} formData - The updated entry data, including potential image file.
     * @throws {Error} If the update request fails.
     */
    const handleUpdateEntry = async (id, formData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authentication required.");
                return;
            }
            const response = await axios.put(`http://localhost:5001/entries/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Necessary for file uploads
                }
            });

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to update entry');
            }

            // Update the specific entry in the local state
            setEntries(entries.map(entry =>
                entry._id === id ? response.data.data : entry
            ));

            // Close modal and reset editing state
            setIsModalOpen(false);
            setIsEditing(false);
            toast.success('Entry updated successfully');
        } catch (error) {
            console.error('Error updating entry:', error);
            toast.error(`Failed to update entry: ${error.message}`);
            throw error; // Re-throw error for potential handling in the modal
        }
    };

    /**
     * @function handleDelete
     * @description Sends a delete request to the backend API for a specific entry.
     * Refreshes the entry list on success and closes relevant modals.
     * Shows success or error toasts.
     * @param {string} id - The ID of the entry to delete.
     */
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authentication required.");
                return;
            }
            const response = await axios.delete(`http://localhost:5001/entries/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Entry deleted successfully!');
                fetchEntries(); // Refresh the list after deletion
                // Close relevant modals
                setIsModalOpen(false); // Close view modal if open
                setIsDeleteModalOpen(false); // Close confirmation modal
                setEntryToDelete(null); // Clear the entry marked for deletion
            } else {
                throw new Error(response.data.message || 'Failed to delete entry');
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            toast.error(`Failed to delete entry: ${error.message}`);
        }
    };

    /**
     * @function handleAddEntry
     * @description Sends a request to create a new entry via the backend API.
     * Handles multipart/form-data for potential image uploads.
     * Closes the new entry modal and refreshes the entry list on success.
     * Shows success or error toasts.
     * @param {object} formData - The data for the new entry (title, content, image).
     */
    const handleAddEntry = async (formData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authentication required.");
                return;
            }

            // Create FormData object to send data, including the image file
            const data = new FormData();
            data.append('title', formData.title);
            data.append('professionalContent', formData.professionalContent);
            data.append('personalContent', formData.personalContent || ''); // Handle optional personal content
            data.append('date', new Date().toISOString()); // Set current date

            if (formData.image) { // Append image only if provided
                data.append('image', formData.image);
            }

            const response = await axios.post('http://localhost:5001/entries', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' // Required for file uploads
                }
            });

            if (response.data.success) {
                toast.success('Entry created successfully!');
                setIsNewEntryModalOpen(false); // Close the new entry modal
                fetchEntries(); // Refresh the list to show the new entry
            } else {
                throw new Error(response.data.message || 'Failed to create entry');
            }
        } catch (error) {
            console.error('Error adding entry:', error);
            toast.error(`Failed to create entry: ${error.message}`);
        }
    };

    // Effect to fetch entries when the component mounts or fetchEntries function reference changes
    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]); // Dependency ensures fetchEntries is stable due to useCallback

    /**
     * @function handleEntryClick
     * @description Fetches the full details of a specific entry when its card is clicked.
     * Updates the `selectedEntry` state and opens the view modal.
     * Shows an error toast if fetching fails.
     * @param {object} entry - The basic entry object (usually just contains ID) from the grid.
     */
    const handleEntryClick = async (entry) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Authentication required.");
                return;
            }
            // Fetch full entry details using its ID
            const response = await axios.get(`http://localhost:5001/entries/${entry._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.data.success || !response.data.data) {
                throw new Error(response.data.message || 'Entry not found');
            }

            const entryData = response.data.data; // Full entry data
            setSelectedEntry(entryData); // Set the selected entry for the modal
            setIsModalOpen(true); // Open the view modal
            setIsEditing(false); // Ensure modal opens in view mode initially
        } catch (error) {
            console.error('Error fetching entry:', error);
            toast.error(`Failed to load entry details: ${error.message}`);
        }
    };

    /**
     * @function handleOpenSummaryModal
     * @description Opens the summary modal. Typically called from within the view/edit modal.
     */
    const handleOpenSummaryModal = () => {
        setIsSummaryModalOpen(true);
    };

    /**
     * @function handleCloseSummaryModal
     * @description Closes the summary modal.
     */
    const handleCloseSummaryModal = () => {
        setIsSummaryModalOpen(false);
    };

    /**
     * @function handleCloseViewModal
     * @description Closes the main view/edit modal and resets editing state.
     * Also ensures the summary modal is closed if it was open within the view modal.
     */
    const handleCloseViewModal = () => {
        setIsModalOpen(false);
        setIsEditing(false); // Reset editing state when closing
        setSelectedEntry(null); // Clear selected entry
        if (isSummaryModalOpen) { // If summary modal was open, close it too
            setIsSummaryModalOpen(false);
        }
    };

    // Map fetched entries to EntryCard components
    const gridItems = entries.map((entry) => (
        <EntryCard
            key={entry._id} // Unique key for React list rendering
            entry={entry} // Pass entry data to the card
            onClick={handleEntryClick} // Pass click handler to open the view modal
        />
    ));

    /**
     * @function calculateDaysSinceLastEntry
     * @description Calculates the number of days between the last entry date and today.
     * @returns {number | null} The number of days, or null if no last entry date exists.
     */
    const calculateDaysSinceLastEntry = () => {
        if (!userData?.lastEntryDate) return null;
        const lastDate = new Date(userData.lastEntryDate);
        const today = new Date();
        // Reset time part to compare dates only
        lastDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysSinceLast = calculateDaysSinceLastEntry();

    return (
        // Main container with gradient background adapting to theme
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-purple-50 dark:from-black dark:via-black dark:to-black flex flex-col">
            <Navbar /> {/* Navigation Bar */}
            <ToastContainer /* Container for displaying notifications */
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" // Or dynamically set based on `theme` state
            />
            {/* Main content area */}
            <div className="container mx-auto px-4 py-8 flex-grow">
                {/* Header section with last entry info and add button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                    {/* Display last entry date and days since */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {userData?.lastEntryDate ? (
                            <>
                                <div>
                                    Last Entry Date: {new Date(userData.lastEntryDate).toLocaleDateString()}
                                </div>
                                {daysSinceLast !== null && (
                                    <div>
                                        Days Since Last Entry: {daysSinceLast}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div>No entries recorded yet.</div>
                        )}
                    </div>

                    {/* Button to open the 'Add New Entry' modal */}
                    <AddEntryButton
                        onClick={() => setIsNewEntryModalOpen(true)}
                        theme={theme} // Pass theme for potential styling
                    />
                </div>

                {/* Conditional rendering: Show message if no entries, otherwise show grid */}
                {entries.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                        <p className="text-xl">No entries yet. Create your first entry!</p>
                    </div>
                ) : (
                    // Grid layout for entry cards
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridItems}
                    </div>
                )}
            </div>

            {/* Modal Manager: Handles rendering all modals based on state */}
            <ModalManager
                theme={theme} // Pass theme to modals
                // New Entry Modal Props
                isNewEntryModalOpen={isNewEntryModalOpen}
                onCloseNewEntryModal={() => setIsNewEntryModalOpen(false)}
                handleAddEntry={handleAddEntry}
                // View/Edit Modal Props
                isModalOpen={isModalOpen}
                selectedEntry={selectedEntry}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)} // Function to switch view modal to edit mode
                onCloseModal={handleCloseViewModal} // Function to close the view/edit modal
                handleUpdateEntry={handleUpdateEntry} // Function to handle saving edits
                // Delete Modal Trigger (from View Modal)
                onTriggerDelete={(id) => {
                    setEntryToDelete(id); // Set the ID of the entry to delete
                    setIsDeleteModalOpen(true); // Open the confirmation modal
                }}
                // Delete Confirmation Modal Props
                isDeleteModalOpen={isDeleteModalOpen}
                entryToDelete={entryToDelete} // Pass the ID to the modal
                handleDelete={handleDelete} // Function to execute deletion
                onCloseDeleteModal={() => {
                    setIsDeleteModalOpen(false); // Close confirmation modal
                    setEntryToDelete(null); // Clear the entry ID
                }}
                // Summary Modal Props
                isSummaryModalOpen={isSummaryModalOpen}
                onOpenSummaryModal={handleOpenSummaryModal} // Function to open summary modal (likely from view modal)
                onCloseSummaryModal={handleCloseSummaryModal} // Function to close summary modal
            />
            <Footer /> {/* Footer Component */}
        </div>
    );
}

export default Entries;
