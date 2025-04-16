import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast AND ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import SignupForm from '../components/SignupForm'; // Import the new component
import beachImage from '../../public/images/beach.jpg'; // Import the background image

const Signup = () => {
    const navigate = useNavigate();
    // Removed useForm hook and related state

    // Renamed onSubmit to handleSignup and adjusted parameters
    // Updated handleSignup to accept firstName and lastName
    const handleSignup = async (firstName, lastName, email, password) => {
        try {
            // Send all required fields to the backend
            const result = await axios.post('http://localhost:3333/api/users/register', {
                firstName: firstName, // Add firstName
                lastName: lastName,   // Add lastName
                email: email,
                password: password
            });

            if (result.data.success) {
                toast.success('Account created successfully! Please log in.'); // Add success toast
                navigate('/'); // Navigate to login page on success
            } else {
                // Handle potential non-error failure responses from backend
                toast.error(result.data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error.response ? error.response.data : error); // Log the actual error data if available

            let errorMessage = 'Error creating account. Please try again.'; // Default message
            if (error.response && error.response.data) {
                // Check for common Mongoose duplicate key error (E11000)
                if (error.response.data.code === 11000 || (typeof error.response.data === 'string' && error.response.data.includes('E11000'))) {
                    errorMessage = 'Email already exists. Please use a different email or login.'; // Update error message
                }
                // Check if the backend sent a specific message
                else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                // Check for Mongoose validation errors object
                else if (error.response.data.errors) {
                    // Get the first validation error message
                    const firstErrorKey = Object.keys(error.response.data.errors)[0];
                    errorMessage = error.response.data.errors[firstErrorKey]?.message || errorMessage;
                }
                // Fallback for other potential error structures
                else if (typeof error.response.data === 'string') {
                     errorMessage = error.response.data;
                }
            }
            toast.error(errorMessage); // Use toast for errors
        }
    };

    // Handler for navigating back to login
    const handleNavigateToLogin = () => {
        navigate('/');
    };

    return (
        // Apply the same layout structure as Login.jsx
        <div
          className="flex min-h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${beachImage})` }}
        >
          {/* Left Column (Structural only) */}
          <div className="w-full md:w-2/3">
            {/* Optional content overlay */}
          </div>

          {/* Right Column (Signup Form with semi-transparent background) */}
          <div className="w-full md:w-1/3 flex items-center justify-center p-8 md:p-12 bg-white bg-opacity-30 backdrop-blur-sm">
            <SignupForm
              onSubmit={handleSignup}
              onNavigateToLogin={handleNavigateToLogin}
            />
          </div>
          <ToastContainer position="top-right" autoClose={3000} theme="colored" /> {/* Add ToastContainer */}
        </div>
    );
};

export default Signup;