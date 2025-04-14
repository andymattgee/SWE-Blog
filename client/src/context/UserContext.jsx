import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    // Try to get initial data from localStorage
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : null;
  });

  const updateUserData = (data) => {
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
  };

  const refreshUserData = async () => {
    console.log("Attempting to refresh user data..."); // Add log
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, cannot refresh."); // Add log
        return;
      }

      // Object to hold the refreshed data
      let refreshedData = {};
      
      // --- Fetch Core User Profile Data ---
      try {
        console.log("Fetching /api/users/me..."); // Add log
        const profileResponse = await axios.get('http://localhost:3333/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile response:', profileResponse.data); // Add log
        if (profileResponse.data) {
          // Store essential profile data (email, image)
          refreshedData.email = profileResponse.data.email;
          refreshedData.image = profileResponse.data.image;
          // Add other fields from /me if needed later
        } else {
           console.log("No data received from /api/users/me"); // Add log
        }
      } catch (error) {
        console.error('Error fetching user profile data:', error.response ? error.response.data : error.message);
        // Handle profile fetch error - maybe clear user data or redirect?
        // For now, we'll proceed without profile data if it fails.
      }

      // --- Fetch Entries Count ---
      try {
        console.log("Fetching /entries count..."); // Add log
        const entriesResponse = await axios.get('http://localhost:3333/entries', {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
        });
        // console.log('Entries response:', entriesResponse.data); // Keep if needed
        refreshedData.entriesCount = entriesResponse.data?.data?.length || 0;
      } catch (error) {
        console.error('Error fetching entries count:', error);
        refreshedData.entriesCount = 0; // Default to 0 on error
      }

      // --- Fetch Todos Count ---
      try {
        console.log("Fetching /api/todos count..."); // Add log
        const todosResponse = await axios.get('http://localhost:3333/api/todos', {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
        });
        // console.log('Todos response:', todosResponse.data); // Keep if needed
        if (todosResponse.data?.data) {
          const allTodos = [
            ...(todosResponse.data.data.today || []),
            ...(todosResponse.data.data.pending || []),
            ...(todosResponse.data.data.overdue || []),
            ...(todosResponse.data.data.completed || [])
          ];
          refreshedData.tasksCount = allTodos.length;
        } else {
          refreshedData.tasksCount = 0;
        }
      } catch (error) {
        console.error('Error fetching todos count:', error);
        refreshedData.tasksCount = 0; // Default to 0 on error
      }

      // --- Update Context State ---
      console.log("Updating user data in context:", refreshedData); // Add log
      updateUserData(refreshedData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
