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
 * - AI summary of blog entries
 * 
 * @component
 */
import React, { useState, useEffect, useCallback, useRef } from 'react'; // Removed useContext as useUser handles it
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
import EntryCard from '../components/EntryCard';
import ModalManager from '../components/ModalManager';
import AddEntryButton from '../components/AddEntryButton'; 
import { ActivityCalendar } from 'react-activity-calendar'; // Keep if used, otherwise remove
import { useUser } from '../context/UserContext'; // Import useUser hook

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
    // State to track the current theme
    const [theme, setTheme] = useState('light'); // Default to light
    const { userData } = useUser(); // Get user data from context

    // Effect to detect theme changes (based on Tailwind's 'dark' class on <html>)
    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
        };

        checkTheme(); // Initial check

        // Observe changes to the class attribute of the html element
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Cleanup observer on component unmount
        return () => observer.disconnect();
    }, []);
    // State management
    const [entries, setEntries] = useState([]); 
    const [selectedEntry, setSelectedEntry] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isEditing, setIsEditing] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false); 

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

            setEntries(entries.map(entry =>
                entry._id === id ? response.data.data : entry
            ));

            setIsModalOpen(false);
            setIsEditing(false);
            toast.success('Entry updated successfully');
        } catch (error) {
            console.error('Error updating entry:', error);
            toast.error(error.message || 'Failed to update entry');
            throw error;
        }
    };

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
                fetchEntries(); 
                setIsModalOpen(false);
                setIsDeleteModalOpen(false); 
            } else {
                throw new Error(response.data.message || 'Failed to delete entry');
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            toast.error(error.message || 'Failed to delete entry');
        }
    };

    const handleAddEntry = async (formData) => {
        try {
            const token = localStorage.getItem('token');

            const data = new FormData();
            data.append('title', formData.title);
            data.append('professionalContent', formData.professionalContent);
            data.append('personalContent', formData.personalContent || '');
            data.append('date', new Date().toISOString());

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
                fetchEntries(); 
            } else {
                throw new Error(response.data.message || 'Failed to create entry');
            }
        } catch (error) {
            console.error('Error adding entry:', error);
            toast.error(error.message || 'Failed to create entry');
        }
    };

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]); 

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

    const gridItems = entries.map((entry) => (
        <EntryCard
            key={entry._id}
            entry={entry}
            onClick={handleEntryClick}
        />
    ));

    const handleOpenSummaryModal = () => {
        setIsSummaryModalOpen(true);
    };

    const handleCloseSummaryModal = () => {
        setIsSummaryModalOpen(false);
    };

    const handleCloseViewModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        if (isSummaryModalOpen) {
            setIsSummaryModalOpen(false);
        }
    };

    return (
        // Light mode: white bg with subtle purple gradient bottom; Dark mode: black bg
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-purple-50 dark:from-black dark:via-black dark:to-black flex flex-col">
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
            <div className="container mx-auto px-4 py-8 flex-grow"> 
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                    {/* Last Entry Info */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {userData?.lastEntryDate ? (
                            <>
                                <div>
                                    Last Entry Date: {new Date(userData.lastEntryDate).toLocaleDateString()}
                                </div>
                                <div>
                                    Days Since Last Entry: {(() => {
                                        const lastDate = new Date(userData.lastEntryDate);
                                        const today = new Date();
                                        // Reset time part to compare dates only
                                        lastDate.setHours(0, 0, 0, 0);
                                        today.setHours(0, 0, 0, 0);
                                        const diffTime = Math.abs(today - lastDate);
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                        return diffDays;
                                    })()}
                                </div>
                            </>
                        ) : (
                            <div>No entries recorded yet.</div>
                        )}
                    </div>

                    {/* Add Entry Button */}
                    <AddEntryButton
                        onClick={() => setIsNewEntryModalOpen(true)}
                        theme={theme} // Pass the current theme
                    />
                </div>

                {entries.length === 0 ? (
                    // Light mode: medium gray text; Dark mode: original light gray
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                        <p className="text-xl">No entries yet. Create your first entry!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gridItems}
                    </div>
                )}
            </div>

            <ModalManager
                theme={theme} // Pass theme here
                isNewEntryModalOpen={isNewEntryModalOpen}
                onCloseNewEntryModal={() => setIsNewEntryModalOpen(false)}
                handleAddEntry={handleAddEntry}
                isModalOpen={isModalOpen}
                selectedEntry={selectedEntry}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onCloseModal={handleCloseViewModal}
                handleUpdateEntry={handleUpdateEntry}
                onTriggerDelete={(id) => {
                    setEntryToDelete(id);
                    setIsDeleteModalOpen(true);
                }}
                isDeleteModalOpen={isDeleteModalOpen}
                entryToDelete={entryToDelete}
                handleDelete={handleDelete}
                onCloseDeleteModal={() => setIsDeleteModalOpen(false)}
                isSummaryModalOpen={isSummaryModalOpen}
                onOpenSummaryModal={handleOpenSummaryModal}
                onCloseSummaryModal={handleCloseSummaryModal}
            />
            <Footer />
        </div>
    );
}

export default Entries;
