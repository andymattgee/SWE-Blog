/**
 * @file Login.jsx
 * @description Renders the login page for the application.
 * This page displays a background image and uses the LoginForm component
 * to handle user input and authentication logic.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import LoginForm from '../components/LoginForm'; // Reusable login form UI component
import { useUser } from '../context/UserContext'; // Hook to access user context functions (update, refresh)
import axios from 'axios'; // Library for making HTTP requests
import mtsVideo from '../../public/videos/mtsVideo.mp4'; // Import the video file

/**
 * @component Login
 * @description The main component for the login page.
 * It orchestrates the login process by providing handlers to the LoginForm component
 * and interacting with the UserContext upon successful authentication.
 * @returns {JSX.Element} The rendered login page component.
 */
const Login = () => {
  const navigate = useNavigate(); // Hook instance for navigation
  // Get functions from UserContext to update user data after login
  const { updateUserData, refreshUserData } = useUser();

  /**
   * @function handleLogin
   * @description Handles the login attempt when the LoginForm is submitted.
   * Sends login credentials (email, password) to the backend API.
   * On success:
   *   - Stores the authentication token in local storage.
   *   - Updates the user context with basic user info (email, counts).
   *   - Triggers a full refresh of user data from the context (fetches profile image, etc.).
   *   - Navigates the user to the Home page.
   * On failure:
   *   - Logs the error to the console. (Error handling within LoginForm might show user feedback)
   * @param {string} email - The email entered by the user.
   * @param {string} password - The password entered by the user.
   */
  const handleLogin = async (email, password) => {
    try {
      // Send POST request to the login endpoint
      const response = await axios.post('http://localhost:5001/api/users/login', {
        email: email,
        password: password
      });

      // Destructure user data and token from the successful response
      const { user, token } = response.data;

      // Store the authentication token in local storage for subsequent requests
      localStorage.setItem('token', token);

      // Prepare initial user data object (basic info available immediately)
      const initialUserData = {
        email: user.email,
        entriesCount: user.entries?.length || 0, // Safely access entries count
        tasksCount: user.todos?.length || 0 // Safely access todos count
      };
      // Update context with this initial data (optional, provides quick feedback)
      updateUserData(initialUserData);

      // Trigger a full refresh of user data in the context
      // This likely fetches more details like profile picture URL, etc.
      await refreshUserData(); // Wait for refresh before navigating if needed, or remove await if navigation should happen immediately

      // Navigate to the Home page after successful login and data refresh initiation
      navigate("/Home");
    } catch (error) {
      // Log detailed error information for debugging
      console.error('Login error:', error.response ? error.response.data : error.message);
      // Note: User-facing error messages (e.g., "Invalid credentials") are typically handled within the LoginForm component based on the error response.
    }
    // Form reset is handled internally by the LoginForm component upon submission attempt.
  };

  /**
   * @function handleForgotPassword
   * @description Placeholder function for the "Forgot Password" action.
   * Currently logs a message to the console.
   */
  const handleForgotPassword = () => {
    // TODO: Implement actual forgot password logic (e.g., navigate to a reset page or open a modal)
    console.log("Forgot password clicked - implementation pending.");
  };

  /**
   * @function handleNavigateToSignup
   * @description Navigates the user to the Signup page.
   * Passed as a prop to the LoginForm component.
   */
  const handleNavigateToSignup = () => {
    navigate("/Signup"); // Use navigate hook to change route
  };

  /**
   * @function handleSocialClick
   * @description Placeholder function for social login button clicks.
   * Logs the clicked platform to the console.
   * @param {string} platform - The name of the social platform clicked (e.g., 'Google', 'Facebook').
   */
  const handleSocialClick = (platform) => {
    // TODO: Implement actual social login logic for the specified platform
    console.log(`Social login clicked: ${platform} - implementation pending.`);
  };

  return (
    // Main container div covering the full screen height with relative positioning
    <div className="relative flex min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline // Important for mobile devices
        className="absolute top-0 left-0 w-full h-full object-cover -z-10" // Position fixed behind content
        src={mtsVideo} // Use the imported video variable
      >
        Your browser does not support the video tag.
      </video>

      {/* Left Column (Spacer/Background Area - maintains layout structure) */}
      {/* This div takes up 2/3 of the width on medium screens and above, acting as a visual spacer */}
      {/* On small screens, it takes full width but is effectively hidden by the right column stacking */}
      {/* Added z-index to ensure it's above the video but below the form */}
      <div className="w-full md:w-2/3 z-0">
        {/* Intentionally empty - serves as part of the background layout */}
      </div>

      {/* Right Column (Login Form Area) */}
      {/* This div takes 1/3 of the width on medium screens and above */}
      {/* On small screens, it takes full width and stacks below the (hidden) left column */}
      {/* Uses flex to center the LoginForm vertically and horizontally */}
      {/* Applies a semi-transparent white background with a blur effect for readability */}
      {/* Added z-index to ensure it's above the video */}
      <div className="w-full md:w-1/3 flex items-center justify-center p-8 md:p-12 bg-white bg-opacity-30 backdrop-blur-sm z-10">
        {/* Render the reusable LoginForm component */}
        {/* Pass handler functions as props to the LoginForm */}
        <LoginForm
          onLogin={handleLogin} // Function to call when the form is submitted
          onForgotPassword={handleForgotPassword} // Function for the "Forgot Password" link
          onNavigateToSignup={handleNavigateToSignup} // Function for the "Sign Up" link
          onSocialClick={handleSocialClick} // Function for social login buttons
        />
      </div>
    </div>
  );
}

export default Login;
