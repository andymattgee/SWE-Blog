// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  
  return isAuthenticated ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
