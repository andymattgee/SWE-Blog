import React from 'react';
import { useNavigate } from 'react-router-dom';
// Removed useForm import
import LogLocalStorage from '../components/LogLocalStorage';
import LoginForm from '../components/LoginForm'; // Import the new component
import { useUser } from '../context/UserContext';
import axios from 'axios';
import beachImage from '../../public/images/beach.jpg'; // Import the image

const Login = () => {
  // Removed useForm hook
  const navigate = useNavigate();
  const { updateUserData, refreshUserData } = useUser(); // Add refreshUserData

  // Removed handleEnterButton and handleSignupButton (will be handled by LoginForm props)
  // Renamed onSubmit to handleLogin and adjusted parameters
  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3333/api/users/login', {
        // Send email and password
        email: email,
        password: password
      });
      
      // The response directly contains user and token
      const { user, token } = response.data;
      
      // If we got here, the login was successful
      localStorage.setItem('token', token);
      // Store email instead of userName
      const userData = {
        email: user.email,
        // userName: user.userName, // Removed userName
        entriesCount: user.entries?.length || 0,
        tasksCount: user.todos?.length || 0
      };
      updateUserData(userData); // Update with initial login data (optional but can provide immediate basic info)
      
      // Now trigger the full refresh to get image URL and latest counts
      refreshUserData(); // Call the refresh function from context
      
      navigate("/Home"); // Navigate after initiating the refresh
    } catch (error) {
      console.error('Login error:', error);
    }

    // Reset is handled within LoginForm now
  };

  // Define handlers for LoginForm props
  const handleForgotPassword = () => {
    console.log("thats too bad"); // Log message as requested
  };

  const handleNavigateToSignup = () => {
    navigate("/Signup"); // Navigate to Signup page
  };

  const handleSocialClick = (platform) => {
    console.log(`clicked on ${platform} button`); // Log message as requested
  };

  return (


    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${beachImage})` }} // Apply background to main container
    >
      {/* Left Column (Image Placeholder) */}
      {/* Left Column (Image Background) */}
      {/* Use w-full md:w-2/3 for responsiveness: full width on small, 2/3 on medium+ */}
      {/* Left Column (Structural only, background is on parent) */}
      <div className="w-full md:w-2/3">
        {/* Optional: Add content overlay here if needed later */}
      </div>

      {/* Right Column (Login Form) */}
      {/* Right Column (Login Form) */}
      {/* Use w-full md:w-1/3 for responsiveness: full width on small, 1/3 on medium+ */}
      {/* Stack columns on small screens by default, flex-row starts at md */}
      {/* Right Column (Login Form with highly transparent background) */}
      <div className="w-full md:w-1/3 flex items-center justify-center p-8 md:p-12 bg-white bg-opacity-30 backdrop-blur-sm"> {/* Reduced opacity */}
        {/* Render the LoginForm component */}
        <LoginForm
          onLogin={handleLogin}
          onForgotPassword={handleForgotPassword}
          onNavigateToSignup={handleNavigateToSignup}
          onSocialClick={handleSocialClick}
        />
      </div>
      {/* Removed Title and LogLocalStorage */}
    </div>
  )
}

export default Login
