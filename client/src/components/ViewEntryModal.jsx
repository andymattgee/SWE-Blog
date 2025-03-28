import React, { useEffect, useRef } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import EntryImage from './EntryImage';

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
 */
const ViewEntryModal = ({ entry, isOpen, onClose, onEdit, onDelete }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!entry) return null;

    const formattedDate = entry.createdAt
        ? new Date(entry.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-gray-900 bg-opacity-90 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white border border-purple-500 shadow-xl">
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
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={onEdit}
                            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                            title="Edit Entry"
                        >
                            <FaEdit size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(entry._id)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                            title="Delete Entry"
                        >
                            <FaTrashAlt size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewEntryModal; 