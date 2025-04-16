import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
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
    const { userData, refreshUserData } = useUser(); // Get refreshUserData from context

    /**
     * useEffect to fetch the latest user data when the component mounts.
     */
    useEffect(() => {
        refreshUserData(); // Fetch latest user data when component mounts
    }, []); // Changed dependency to empty array to run only on mount

    // State to control the visibility of the password change modal
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    // State to hold the selected profile picture file
    const [selectedFile, setSelectedFile] = useState(null);

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

    /**
     * Handles the file input change event.
     * Updates the selectedFile state with the chosen file.
     */
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            console.log("File selected:", event.target.files[0].name); // Log selection
        }
    };

    /**
     * Handles the submission of the profile picture.
     * Currently logs the file name to the console.
     */
    const handleSubmitProfilePic = async () => { // Make the function async
        if (!selectedFile) {
            console.log('No file selected to upload.');
            // Optionally show a user-friendly message here
            return;
        }

        const formData = new FormData();
        // Use 'profilePic' as the key, matching the expected field name in the backend middleware
        formData.append('profilePic', selectedFile);

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authentication token not found.');
            // Handle missing token, e.g., redirect to login
            return;
        }

        try {
            console.log('Uploading profile picture:', selectedFile.name);
            // Send POST request to the backend endpoint
            const response = await axios.post('http://localhost:3333/api/users/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Upload successful:', response.data);
            // Refresh user data in context so Navbar and other components get the new image URL
            refreshUserData();
            alert('Profile picture updated successfully!'); // Simple feedback

            // Reset file state after successful upload
            setSelectedFile(null);
            const fileInput = document.getElementById('profilePicUpload');
            if (fileInput) {
                fileInput.value = ''; // Reset file input value
            }

        } catch (error) {
            console.error('Error uploading profile picture:', error.response ? error.response.data : error.message);
            // Show user-friendly error message
            alert(`Error uploading picture: ${error.response?.data?.message || error.message}`);
        }
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
                            <span className="font-semibold">Email:</span> {/* Changed label */}
                            <span>{userData.email}</span> {/* Changed to display email */}
                        </div>
                        {/* Display user's full name */}
                        {/* Border - Light: light gray; Dark: original dark gray */}
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="font-semibold">Name:</span>
                            <span>{`${userData.firstName || ''} ${userData.lastName || ''}`}</span>
                        </div>
                        {/* Display user blog entries count */}
                        {/* Border - Light: light gray; Dark: original dark gray */}
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="font-semibold">Blog Entries:</span>
                            <span>{userData.entriesCount}</span>
                        </div>
                        {/* Display last entry date */}
                        {/* Border - Light: light gray; Dark: original dark gray */}
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                            <span className="font-semibold">Last Entry Date:</span>
                            <span>
                                {userData.lastEntryDate
                                    ? new Date(userData.lastEntryDate).toLocaleDateString()
                                    : 'N/A'}
                            </span>
                        </div>
                        {/* Action Buttons Container */}
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
                            {/* Change Password Button */}
                            <button
                                onClick={handlePasswordChange}
                                className="bg-transparent dark:bg-blue-600 hover:bg-blue-100 dark:hover:bg-blue-700 text-blue-700 dark:text-white font-bold py-2 px-4 rounded-lg transition duration-200 border border-blue-500 dark:border-blue-400 w-full sm:w-auto"
                            >
                                Change Password
                            </button>

                            {/* Profile Picture Upload Section */}
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    id="profilePicUpload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden" // Keep the actual input hidden
                                />
                                {/* Label Styled as Button */}
                                <label
                                    htmlFor="profilePicUpload"
                                    className="cursor-pointer bg-transparent dark:bg-green-600 hover:bg-green-100 dark:hover:bg-green-700 text-green-700 dark:text-white font-bold py-2 px-4 rounded-lg transition duration-200 border border-green-500 dark:border-green-400 w-full sm:w-auto text-center"
                                >
                                    Choose Picture
                                </label>

                                {/* Submit Button - Appears only when a file is selected */}
                                {selectedFile && (
                                    <button
                                        onClick={handleSubmitProfilePic}
                                        className="bg-transparent dark:bg-purple-600 hover:bg-purple-100 dark:hover:bg-purple-700 text-purple-700 dark:text-white font-bold py-2 px-4 rounded-lg transition duration-200 border border-purple-500 dark:border-purple-400 w-full sm:w-auto"
                                    >
                                        Upload Picture
                                    </button>
                                )}
                            </div>
                        </div>
                         {/* Display selected file name */}
                         {selectedFile && (
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Selected: {selectedFile.name}
                            </div>
                        )}
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
