import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import PasswordChangeModal from './PasswordChangeModal';
import Footer from './Footer';

/**
 * UserProfile component displays the user's profile information and allows
 * the user to change their password.
 *
 * It fetches user data from context and displays it in a structured format.
 */
const UserProfile = () => {
    const { userData, refreshUserData } = useUser();

    /**
     * useEffect to fetch the latest user data when the component mounts.
     */
    useEffect(() => {
        refreshUserData(); // Fetch latest user data when component mounts
    }, [refreshUserData]); // Added dependency

    // State to control the visibility of the password change modal
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    /**
     * Opens the password change modal.
     */
    const handlePasswordChange = () => {
        setIsPasswordModalOpen(true);
    };

    /**
     * Closes the password change modal.
     */
    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };


    // If user data is not available, show a loading message
    if (!userData) {
        return (
            // Loading State - Light: white bg; Dark: black bg (simplified)
            <div className="min-h-screen bg-white dark:bg-black flex flex-col">
                <Navbar />
                {/* Loading State - Light: dark text; Dark: white text */}
                <div className="container mx-auto px-4 py-8 text-center text-gray-900 dark:text-white flex-grow">
                    Loading user data...
                </div>
                <div className="mt-auto">
                    <Footer />
                </div>
            </div>
        );
    }


    return (
        // Main View - Light: white bg; Dark: black bg (simplified)
        <div className="min-h-screen bg-white dark:bg-black flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-grow">
                {/* Profile Card - Light: white bg, gray border; Dark: original dark bg */}
                <div className="max-w-2xl mx-auto bg-white dark:bg-opacity-80 dark:bg-gray-900 rounded-lg shadow-lg p-6 text-gray-900 dark:text-white mb-12 border border-gray-200 dark:border-transparent">
                    {/* Title - Light: darker blue; Dark: original blue */}
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">User Profile</h1>
                    <div className="space-y-4">
                        {/* Display user name */}
                        {/* Border - Light: light gray; Dark: original dark gray */}
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="font-semibold">Name:</span>
                            <span>{userData.userName}</span>
                        </div>
                        {/* Display user blog entries count */}
                        {/* Border - Light: light gray; Dark: original dark gray */}
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="font-semibold">Blog Entries:</span>
                            <span>{userData.entriesCount}</span>
                        </div>
                        {/* Display user tasks count */}
                        {/* Border - Light: light gray; Dark: original dark gray */}
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="font-semibold">Tasks:</span>
                            <span>{userData.tasksCount}</span>
                        </div>
                        {/* Button to change password */}
                        <div className="flex justify-center pt-4">
                            {/* Button - Light: blue border, blue text; Dark: original styles */}
                            <button 
                                onClick={handlePasswordChange}
                                className="bg-transparent dark:bg-blue-600 hover:bg-blue-100 dark:hover:bg-blue-700 text-blue-700 dark:text-white font-bold py-2 px-4 rounded-lg transition duration-200 border border-blue-500 dark:border-blue-400"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
            {/* Ensure PasswordChangeModal also supports themes if necessary */}
            <PasswordChangeModal 
                isOpen={isPasswordModalOpen} 
                onClose={handleClosePasswordModal} 
            />
        </div>
    );
};

export default UserProfile;
