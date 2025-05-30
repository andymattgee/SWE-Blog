import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import HamsterLoader from './HamsterLoader';

/**
 * Formats the AI response to properly render lists in HTML
 * @param {string} content - The content from OpenAI that may contain lists
 * @returns {JSX.Element} Formatted content with proper list rendering
 */
const formatSummaryContent = (content) => {
    if (!content) return null;

    // Check if the content appears to be in a list format
    const hasListItems = content.includes('- ') || content.includes('• ') || 
                          content.includes('* ') || /^\d+\.\s/.test(content);
    
    if (hasListItems) {
        // Split content by lines
        const lines = content.split('\n').filter(line => line.trim() !== '');
        
        // Check if we have numbered list (1. 2. 3.)
        const isNumberedList = lines.some(line => /^\d+\.\s/.test(line.trim()));
        
        // Check if we have bullet list (-, •, *)
        const isBulletList = lines.some(line => 
            line.trim().startsWith('- ') || 
            line.trim().startsWith('• ') || 
            line.trim().startsWith('* ')
        );
        
        if (isNumberedList) {
            return (
                <ol className="list-decimal pl-6 space-y-2">
                    {lines.map((line, index) => {
                        // Remove number prefix for clean display in <li>
                        const cleanLine = line.trim().replace(/^\d+\.\s*/, '');
                        return cleanLine ? <li key={index}>{cleanLine}</li> : null;
                    })}
                </ol>
            );
        } else if (isBulletList) {
            return (
                <ul className="list-disc pl-6 space-y-2">
                    {lines.map((line, index) => {
                        // Remove bullet prefix for clean display in <li>
                        const cleanLine = line.trim().replace(/^[-•*]\s*/, '');
                        return cleanLine ? <li key={index}>{cleanLine}</li> : null;
                    })}
                </ul>
            );
        }
    }
    
    // If not a list or couldn't parse as a list, render as regular text with paragraphs
    return (
        <div className="space-y-4">
            {content.split('\n\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
            ))}
        </div>
    );
};

/**
 * ViewSummaryModal Component
 * Displays an AI-generated summary of a blog entry
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Object} props.entry - The entry object being viewed
 */
const ViewSummaryModal = ({ theme = 'dark', isOpen, onClose, entry }) => { // Add theme prop, default to dark
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
                className={`rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-xl ${
                    theme === 'light'
                    ? 'bg-white text-gray-900 border border-gray-300'
                    : 'bg-gray-900 bg-opacity-95 text-white border border-purple-500'
                }`}
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
                        className={`text-xl font-bold ${theme === 'light' ? 'text-gray-500 hover:text-gray-800' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        ×
                    </button>
                </div>
                <div className="flex justify-center items-center mb-4">
                    <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-purple-700' : 'text-blue-400'}`}>AI Summary</h2>
                </div>

                <div className="space-y-6">
                    {showLoading && (
                        <div className="text-center py-8 flex flex-col items-center justify-center">
                            <HamsterLoader />
                            <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Generating AI summary...</p>
                        </div>
                    )}
                    
                    {showError && (
                        <div className="text-center py-8">
                            <p className={`mb-4 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>Unable to generate or retrieve summary for this entry.</p>
                            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Please close this modal and try again.</p>
                        </div>
                    )}
                    
                    {showSummary && (
                        <>
                            <div>
                                <h3 className={`text-lg font-medium mb-2 ${theme === 'light' ? 'text-purple-600' : 'text-blue-400'}`}>Professional Summary</h3>
                                <div className={`rounded-lg p-4 border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                                    <div className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>
                                        {formatSummaryContent(summary.professionalSummary)}
                                    </div>
                                </div>
                            </div>
                            
                            {summary.personalSummary && (
                                <div>
                                    <h3 className={`text-lg font-medium mb-2 ${theme === 'light' ? 'text-purple-600' : 'text-blue-400'}`}>Personal Summary</h3>
                                    <div className={`rounded-lg p-4 border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                                        <div className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-300'}`}>
                                            {formatSummaryContent(summary.personalSummary)}
                                        </div>
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
                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                            theme === 'light'
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewSummaryModal; 