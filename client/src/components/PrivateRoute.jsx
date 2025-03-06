// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ element: Component }) => {
  // Check if the user is authenticated by verifying the presence of a token in local storage
  const isAuthenticated = !!localStorage.getItem('token');
  
  // If the user is authenticated, render the requested component; otherwise, redirect to the home page
  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
