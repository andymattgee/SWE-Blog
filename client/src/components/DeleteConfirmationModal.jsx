import React from 'react';

/**
 * DeleteConfirmationModal Component for confirming entry deletion
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onConfirm - Function to handle deletion confirmation
 * @param {Function} props.onCancel - Function to handle cancellation
 * @returns {JSX.Element} The confirmation modal component
 */
const DeleteConfirmationModal = ({ theme = 'dark', onConfirm, onCancel }) => { // Add theme prop, default to dark
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className={`rounded-lg p-6 shadow-xl ${
                theme === 'light'
                ? 'bg-white text-gray-900 border border-gray-300'
                : 'bg-gray-900 bg-opacity-95 text-white border border-purple-500'
            }`}>
                <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-red-700' : 'text-blue-400'}`}>Confirm Deletion</h2>
                <p className={`mb-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Are you sure you want to delete this entry? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className={`px-4 py-2 rounded-lg ${
                            theme === 'light'
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg border ${
                            theme === 'light'
                            ? 'bg-red-600 text-white hover:bg-red-700 border-red-700'
                            : 'bg-red-600 text-white hover:bg-red-700 border-red-400'
                        }`}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal; 