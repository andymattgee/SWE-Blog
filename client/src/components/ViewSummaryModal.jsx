import React, { useEffect, useRef } from 'react';

/**
 * ViewSummaryModal Component
 * Displays an AI-generated summary of a blog entry
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when closing the modal
 */
const ViewSummaryModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);
    
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
                className="bg-gray-900 bg-opacity-90 rounded-lg p-6 max-w-lg w-full max-h-[70vh] overflow-y-auto text-white border border-purple-500 shadow-xl"
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

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 min-h-[150px]">
                    <p className="text-gray-300">Your AI summarized blog entry will go here.</p>
                </div>

                <div className="flex justify-end mt-4">
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