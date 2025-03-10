import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import { useUser } from '../context/UserContext';
import PasswordChangeModal from './PasswordChangeModal';

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
    }, []);

    // If user data is not available, show a loading message
    if (!userData) {
        return (
            <div className="min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
                <Navbar />
                <div className="container mx-auto px-4 py-8 text-center text-white">
                    Loading user data...
                </div>
            </div>
        );
    }

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

    return (
        <div className="min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-opacity-80 bg-gray-900 rounded-lg shadow-lg p-6 text-white">
                    <h1 className="text-3xl font-bold text-blue-400 mb-6">User Profile</h1>
                    <div className="space-y-4">
                        {/* Display user name */}
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <span className="font-semibold">Name:</span>
                            <span>{userData.userName}</span>
                        </div>
                        {/* Display user blog entries count */}
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <span className="font-semibold">Blog Entries:</span>
                            <span>{userData.entriesCount}</span>
                        </div>
                        {/* Display user tasks count */}
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <span className="font-semibold">Tasks:</span>
                            <span>{userData.tasksCount}</span>
                        </div>
                        {/* Button to change password */}
                        <div className="flex justify-center pt-4">
                            <button 
                                onClick={handlePasswordChange}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 border border-blue-400"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <PasswordChangeModal 
                isOpen={isPasswordModalOpen} 
                onClose={handleClosePasswordModal} 
            />
        </div>
    );
};

export default UserProfile;
