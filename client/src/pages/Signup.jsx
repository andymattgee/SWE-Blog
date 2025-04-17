import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast notifications and container
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS for styling
import SignupForm from '../components/SignupForm'; // Import the SignupForm component
import beachImage from '../../public/images/beach.jpg'; // Import the background image

/**
 * Signup component renders the user registration page.
 * It handles user input submission via the SignupForm component,
 * communicates with the backend API to register the user,
 * provides feedback using toast notifications, and navigates the user upon success or failure.
 */
const Signup = () => {
    const navigate = useNavigate(); // Hook for programmatic navigation

    /**
     * Handles the signup form submission.
     * Sends user registration data (firstName, lastName, email, password) to the backend API.
     * Displays success or error messages using toast notifications.
     * Navigates to the login page ('/') upon successful registration.
     * @param {string} firstName - The user's first name.
     * @param {string} lastName - The user's last name.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's chosen password.
     */
    const handleSignup = async (firstName, lastName, email, password) => {
        try {
            // Make a POST request to the registration endpoint
            const result = await axios.post('http://localhost:5001/api/users/register', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            });

            // Check if the backend indicates success
            if (result.data.success) {
                toast.success('Account created successfully! Please log in.'); // Show success message
                navigate('/'); // Redirect to the login page
            } else {
                // Handle cases where the backend responds with success: false but no specific error
                toast.error(result.data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            // Log the detailed error for debugging purposes
            console.error('Signup error:', error.response ? error.response.data : error);

            // Determine the appropriate error message to display to the user
            let errorMessage = 'Error creating account. Please try again.'; // Default error message
            if (error.response && error.response.data) {
                // Specific handling for duplicate email errors (Mongoose E11000)
                if (error.response.data.code === 11000 || (typeof error.response.data === 'string' && error.response.data.includes('E11000'))) {
                    errorMessage = 'Email already exists. Please use a different email or login.';
                }
                // Use the message provided by the backend if available
                else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                // Handle Mongoose validation errors (extract the first error message)
                else if (error.response.data.errors) {
                    const firstErrorKey = Object.keys(error.response.data.errors)[0];
                    errorMessage = error.response.data.errors[firstErrorKey]?.message || errorMessage;
                }
                // Handle cases where the error data is just a string
                else if (typeof error.response.data === 'string') {
                     errorMessage = error.response.data;
                }
            }
            toast.error(errorMessage); // Display the determined error message
        }
    };

    /**
     * Handles navigation back to the login page.
     * This is typically triggered by a button or link in the SignupForm.
     */
    const handleNavigateToLogin = () => {
        navigate('/'); // Navigate to the root route (Login page)
    };

    return (
        // Main container div with background image and flex layout
        <div
          className="flex min-h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${beachImage})` }} // Apply background image dynamically
        >
          {/* Left Column: Takes up 2/3 width on medium screens and above, primarily for layout spacing */}
          <div className="w-full md:w-2/3">
            {/* Content for the left side could be added here if needed */}
          </div>

          {/* Right Column: Contains the SignupForm, takes 1/3 width on medium screens, centered content */}
          <div className="w-full md:w-1/3 flex items-center justify-center p-8 md:p-12 bg-white bg-opacity-30 backdrop-blur-sm">
            {/* Render the SignupForm component */}
            <SignupForm
              onSubmit={handleSignup} // Pass the signup handler function as a prop
              onNavigateToLogin={handleNavigateToLogin} // Pass the navigation handler function as a prop
            />
          </div>
          {/* ToastContainer for displaying notifications */}
          <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div>
    );
};

export default Signup; // Export the Signup component for use in routing