import React from 'react';

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

export default ExitConfirmationModal; 