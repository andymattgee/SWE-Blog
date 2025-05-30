import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * PasswordChangeModal component allows users to change their password.
 * It provides a form to input the current password, new password, and
 * confirmation of the new password.
 *
 * Props:
 * - isOpen: Boolean to control modal visibility.
 * - onClose: Function to close the modal.
 */
const PasswordChangeModal = ({ isOpen, onClose }) => {
    // State variables for password fields and loading state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    /**
     * Clears the password input fields.
     */
    const clearFields = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    /**
     * Handles the form submission for changing the password.
     * Validates the input and sends a request to the server.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            clearFields();
            return;
        }

        setIsLoading(true);
        try {
            // NOTE: The API endpoint '/api/users/change-password' might need adjustment
            // depending on your actual backend setup.
            const response = await fetch('http://localhost:5001/api/users/change-password', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to change password');
            }

            toast.success('Password changed successfully');
            clearFields();
            onClose();
        } catch (error) {
            toast.error(error.message);
            clearFields();
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal: Light bg, dark text, gray border; Dark: original styles */}
            <div className="bg-white dark:bg-gray-900 dark:bg-opacity-90 rounded-lg p-6 w-full max-w-md text-gray-900 dark:text-white border border-gray-300 dark:border-purple-500 shadow-xl">
                {/* Title: Darker blue light; Original blue dark */}
                <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        {/* Label: Darker gray light; Original light gray dark */}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Password
                        </label>
                        <div className="relative">
                            {/* Input: Light bg, dark text, gray border; Dark: original styles */}
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {/* Eye Icon: Darker gray light; Original gray dark */}
                                {showCurrentPassword ? <FaEyeSlash className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-600" /> : <FaEye className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-600" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        {/* Label: Darker gray light; Original light gray dark */}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                        </label>
                        <div className="relative">
                            {/* Input: Light bg, dark text, gray border; Dark: original styles */}
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {/* Eye Icon: Darker gray light; Original gray dark */}
                                {showNewPassword ? <FaEyeSlash className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-600" /> : <FaEye className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-600" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        {/* Label: Darker gray light; Original light gray dark */}
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            {/* Input: Light bg, dark text, gray border; Dark: original styles */}
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {/* Eye Icon: Darker gray light; Original gray dark */}
                                {showConfirmPassword ? <FaEyeSlash className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-600" /> : <FaEye className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-600" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2"> {/* Added pt-2 for spacing */}
                        {/* Cancel Button: Light gray bg/border, dark text; Dark: original styles */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-700"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        {/* Submit Button: Original styles (blue bg, white text) work for both modes */}
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md border border-blue-400 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
