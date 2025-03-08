import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import { useUser } from '../context/UserContext';
import PasswordChangeModal from './PasswordChangeModal';

const UserProfile = () => {
    const { userData, refreshUserData } = useUser();

    useEffect(() => {
        refreshUserData(); // Fetch latest user data when component mounts
    }, []);

    if (!userData) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-8 text-center">
                    Loading user data...
                </div>
            </>
        );
    }

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handlePasswordChange = () => {
        setIsPasswordModalOpen(true);
    };

    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">User Profile</h1>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold">Name:</span>
                        <span>{userData.userName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold">Blog Entries:</span>
                        <span>{userData.entriesCount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-semibold">Tasks:</span>
                        <span>{userData.tasksCount}</span>
                    </div>

                    <div className="flex justify-center pt-4">
                        <button 
                            onClick={handlePasswordChange}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
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
        </>
    );
};

export default UserProfile;
