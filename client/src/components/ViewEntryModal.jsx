import React, { useEffect, useRef, useState } from 'react';
import EntryImage from './EntryImage';
import DeleteButton from './DeleteButton'; // Import the new delete button
import EditButton from './EditButton'; // Import the new edit button
import SummarizeButton from './SummarizeButton'; // Import the new summarize button
import axios from 'axios';
import { toast } from 'react-toastify';

// Function to process Quill content for display
const processQuillContent = (content) => {
    if (!content) return '';
    return content;
};

/**
 * ViewEntryModal Component
 * Displays a single entry's details in a modal with options to edit or delete
 * 
 * @param {Object} props
 * @param {Object} props.entry - The entry object to display
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.onSummarize - Function to call when summarize button is clicked
 * @param {boolean} props.isSummaryOpen - Whether the summary modal is open
 */
const ViewEntryModal = ({ entry, isOpen, onClose, onEdit, onDelete, onSummarize, isSummaryOpen }) => {
    const modalRef = useRef(null);
    // Use the prop to keep track of summary modal state
    const [isLocalSummaryOpen, setIsLocalSummaryOpen] = useState(isSummaryOpen || false);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    
    // Clear any old summary data when a new entry is viewed
    useEffect(() => {
        if (entry && entry._id) {
            // Check if there's cached summary data for a different entry
            const storedSummary = localStorage.getItem('entrySummary');
            if (storedSummary) {
                try {
                    const parsedSummary = JSON.parse(storedSummary);
                    // If it's for a different entry, clear it
                    if (parsedSummary.entryId !== entry._id) {
                        localStorage.removeItem('entrySummary');
                    }
                } catch (error) {
                    // If there's an error parsing, clear it
                    localStorage.removeItem('entrySummary');
                }
            }
        }
    }, [entry]);

    // Update local state when prop changes
    useEffect(() => {
        setIsLocalSummaryOpen(isSummaryOpen || false);
    }, [isSummaryOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only close if summary is not open and click is outside
            if (!isLocalSummaryOpen && modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, isLocalSummaryOpen]);

    if (!entry) return null;

    const formattedDate = entry.createdAt
        ? new Date(entry.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null;
    
    // Handle the summarize button click
    const handleSummarizeClick = async () => {
        if (!entry || !entry._id) {
            toast.error('Cannot summarize: Invalid entry');
            return;
        }

        try {
            setIsLoadingSummary(true);
            
            // Create a key specific to this entry
            const entryKey = `entrySummary_${entry._id}`;
            
            // Check if we already have a valid summary for this entry
            const existingSummary = localStorage.getItem(entryKey);
            if (existingSummary) {
                try {
                    const parsed = JSON.parse(existingSummary);
                    const isRecent = (new Date().getTime() - parsed.timestamp) < (60 * 60 * 1000);
                    
                    if (isRecent && parsed.entryId === entry._id) {
                        // We already have a valid summary, just open the modal
                        onSummarize();
                        setIsLocalSummaryOpen(true);
                        setIsLoadingSummary(false);
                        return;
                    }
                } catch (error) {
                    // Invalid cache, continue with API call
                    console.warn('Invalid cached summary, generating a new one');
                }
            }
            
            // First open the modal so user sees loading state
            onSummarize();
            setIsLocalSummaryOpen(true);
            
            // Mark the current entry for which we're fetching a summary
            localStorage.setItem('currentSummaryEntryId', entry._id);
            
            // Get token from local storage
            const token = localStorage.getItem('token');
            
            // Make API request to generate summary
            const response = await axios.post(
                'http://localhost:3333/api/summary/generate',
                {
                    professionalContent: entry.professionalContent,
                    personalContent: entry.personalContent,
                    entryId: entry._id // Send entry ID to backend
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Check if the request was successful
            if (response.data.success) {
                // Store the summary in localStorage with entry ID as part of the key
                localStorage.setItem(entryKey, JSON.stringify({
                    professionalSummary: response.data.data.professionalSummary,
                    personalSummary: response.data.data.personalSummary,
                    entryId: entry._id,
                    timestamp: new Date().getTime()
                }));
                
                // Also store in the general key for ViewSummaryModal to access
                localStorage.setItem('entrySummary', JSON.stringify({
                    professionalSummary: response.data.data.professionalSummary,
                    personalSummary: response.data.data.personalSummary,
                    entryId: entry._id,
                    timestamp: new Date().getTime()
                }));
                
                // Remove the current entry marker
                localStorage.removeItem('currentSummaryEntryId');
            } else {
                toast.error('Failed to generate summary');
            }
        } catch (error) {
            console.error('Error generating summary:', error);
            toast.error('Error generating summary: ' + (error.response?.data?.message || error.message));
            
            // Clean up in case of errors
            localStorage.removeItem('currentSummaryEntryId');
        } finally {
            setIsLoadingSummary(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div 
                ref={modalRef} 
                className="bg-gray-900 bg-opacity-90 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto text-white border border-purple-500 shadow-xl"
            >
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-200">x</button>
                </div>
                <div className="flex justify-center items-center mb-2">
                    <h2 className="text-2xl font-bold text-blue-400">{entry.title}</h2>
                </div>

                {formattedDate && (
                    <div className="text-center text-gray-400 text-sm mb-6">
                        {formattedDate}
                    </div>
                )}

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
                        <div className="flex">
                            <SummarizeButton
                                onClick={handleSummarizeClick}
                                disabled={isLoadingSummary}
                                isLoading={isLoadingSummary}
                            />
                        </div>
                        <div className="flex space-x-4">
                            <EditButton onClick={onEdit} />
                            <DeleteButton onClick={() => onDelete(entry._id)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEntryModal; 