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
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Get current user data
      const currentData = { ...userData };
      
      // Get entries count
      try {
        const entriesResponse = await axios.get('http://localhost:3333/entries', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Entries response:', entriesResponse.data);
        if (entriesResponse.data && entriesResponse.data.data) {
          currentData.entriesCount = entriesResponse.data.data.length;
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
        currentData.entriesCount = 0;
      }

      // Get todos count
      try {
        const todosResponse = await axios.get('http://localhost:3333/api/todos', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Todos response:', todosResponse.data);
        if (todosResponse.data && todosResponse.data.data) {
          const allTodos = [
            ...(todosResponse.data.data.today || []),
            ...(todosResponse.data.data.pending || []),
            ...(todosResponse.data.data.overdue || []),
            ...(todosResponse.data.data.completed || [])
          ];
          currentData.tasksCount = allTodos.length;
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
        currentData.tasksCount = 0;
      }

      // Keep existing user email if available
      if (userData && userData.email) {
        currentData.email = userData.email;
      }

      updateUserData(currentData);
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
