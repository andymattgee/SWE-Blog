import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

/**
 * ViewSummaryModal Component
 * Displays an AI-generated summary of a blog entry
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Object} props.entry - The entry object being viewed
 */
const ViewSummaryModal = ({ isOpen, onClose, entry }) => {
    const modalRef = useRef(null);
    const [summary, setSummary] = useState({
        professionalSummary: '',
        personalSummary: null,
        entryId: null,
        loading: true
    });
    
    // Track if a summary is currently being generated
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Set a timeout to show an error message if the summary takes too long
    const timeoutRef = useRef(null);
    
    // Check if this is a new request or if we have a result
    useEffect(() => {
        if (isOpen && entry?._id) {
            // First check if we have a specific summary for this entry
            const entryKey = `entrySummary_${entry._id}`;
            const specificSummary = localStorage.getItem(entryKey);
            
            if (specificSummary) {
                try {
                    const parsedSummary = JSON.parse(specificSummary);
                    // Verify this summary is for the current entry
                    if (parsedSummary.entryId === entry._id) {
                        // Check if summary is recent (less than 1 hour old)
                        const isRecent = (new Date().getTime() - parsedSummary.timestamp) < (60 * 60 * 1000);
                        
                        if (isRecent) {
                            setSummary({
                                professionalSummary: parsedSummary.professionalSummary,
                                personalSummary: parsedSummary.personalSummary,
                                entryId: parsedSummary.entryId,
                                loading: false
                            });
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error parsing stored entry-specific summary:', error);
                }
            }
            
            // Fall back to the general summary key
            const storedSummary = localStorage.getItem('entrySummary');
            if (storedSummary) {
                try {
                    const parsedSummary = JSON.parse(storedSummary);
                    
                    // Verify this summary is for the current entry
                    if (parsedSummary.entryId === entry._id) {
                        // Check if summary is recent (less than 1 hour old)
                        const isRecent = (new Date().getTime() - parsedSummary.timestamp) < (60 * 60 * 1000);
                        
                        if (isRecent) {
                            setSummary({
                                professionalSummary: parsedSummary.professionalSummary,
                                personalSummary: parsedSummary.personalSummary,
                                entryId: parsedSummary.entryId,
                                loading: false
                            });
                            return;
                        }
                    } else {
                        // Wrong entry, show error
                        setSummary({
                            professionalSummary: '',
                            personalSummary: null,
                            entryId: null,
                            loading: false
                        });
                        toast.error('Summary data mismatch. Please try again.');
                        return;
                    }
                } catch (error) {
                    console.error('Error parsing stored summary:', error);
                }
            }
            
            // Check if we're currently generating a summary
            const currentSummaryEntryId = localStorage.getItem('currentSummaryEntryId');
            
            // If we're generating for this entry, show loading state
            if (currentSummaryEntryId === entry._id) {
                setIsGenerating(true);
                
                // Set a timeout to show an error after 30 seconds
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setIsGenerating(false);
                    setSummary({
                        professionalSummary: '',
                        personalSummary: null,
                        entryId: null,
                        loading: false
                    });
                    toast.error('Summary generation timed out. Please try again.');
                    localStorage.removeItem('currentSummaryEntryId');
                }, 30000); // 30 second timeout
                
                // Set up a polling mechanism to check for the summary
                const checkForSummary = setInterval(() => {
                    const latestSummary = localStorage.getItem('entrySummary');
                    if (latestSummary) {
                        try {
                            const parsed = JSON.parse(latestSummary);
                            if (parsed.entryId === entry._id) {
                                clearInterval(checkForSummary);
                                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                
                                setIsGenerating(false);
                                setSummary({
                                    professionalSummary: parsed.professionalSummary,
                                    personalSummary: parsed.personalSummary,
                                    entryId: parsed.entryId,
                                    loading: false
                                });
                            }
                        } catch (error) {
                            console.error('Error checking for latest summary:', error);
                        }
                    }
                }, 1000); // Check every second
                
                // Clean up interval on unmount
                return () => {
                    clearInterval(checkForSummary);
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                };
            }
            
            // If we don't have a valid summary and aren't generating one, show error state
            setSummary({
                professionalSummary: '',
                personalSummary: null,
                entryId: null,
                loading: false
            });
        }
        
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isOpen, entry]);
    
    // Reset state when closing the modal
    useEffect(() => {
        if (!isOpen) {
            setIsGenerating(false);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [isOpen]);
    
    // A completely different approach to handle modal clicks:
    // Instead of using mousedown events which can bubble,
    // we'll only handle specific click events on our UI elements
    
    if (!isOpen) return null;
    
    // This handles clicks on the overlay background
    const handleBackdropClick = (e) => {
        // Only close if the actual backdrop was clicked (not any children)
        if (e.target === e.currentTarget) {
            onClose();
        }
        
        // Always stop propagation to prevent reaching the underlying modal
        e.stopPropagation();
    };
    
    // This stops any click within the modal content from propagating
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // Determine what to display
    const showLoading = summary.loading || isGenerating;
    const showError = !showLoading && !summary.professionalSummary;
    const showSummary = !showLoading && summary.professionalSummary;

    return (
        // Use mouseDown, mouseUp and click handlers to capture all possible events
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
            onClick={handleBackdropClick}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
        >
            <div 
                ref={modalRef} 
                className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto text-white border border-purple-500 shadow-xl"
                onClick={handleModalClick}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
            >
                <div className="flex justify-end">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-200"
                    >
                        x
                    </button>
                </div>
                <div className="flex justify-center items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-400">AI Summary</h2>
                </div>

                <div className="space-y-6">
                    {showLoading && (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-300">Generating AI summary...</p>
                        </div>
                    )}
                    
                    {showError && (
                        <div className="text-center py-8">
                            <p className="text-red-400 mb-4">Unable to generate or retrieve summary for this entry.</p>
                            <p className="text-gray-300">Please close this modal and try again.</p>
                        </div>
                    )}
                    
                    {showSummary && (
                        <>
                            <div>
                                <h3 className="text-lg font-medium text-blue-400 mb-2">Professional Summary</h3>
                                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <p className="text-gray-300">{summary.professionalSummary}</p>
                                </div>
                            </div>
                            
                            {summary.personalSummary && (
                                <div>
                                    <h3 className="text-lg font-medium text-blue-400 mb-2">Personal Summary</h3>
                                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                        <p className="text-gray-300">{summary.personalSummary}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewSummaryModal; 