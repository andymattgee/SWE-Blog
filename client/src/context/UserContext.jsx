import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

/**
 * @typedef {object} UserData
 * @property {string} [firstName] - The user's first name.
 * @property {string} [lastName] - The user's last name.
 * @property {string} [email] - The user's email address.
 * @property {string} [image] - URL to the user's profile image.
 * @property {number} [entriesCount] - The total number of entries the user has.
 * @property {string|null} [lastEntryDate] - The creation date of the user's most recent entry, or null if none exist.
 */

/**
 * @typedef {object} UserContextType
 * @property {UserData|null} userData - The current user's data, or null if not logged in or loaded.
 * @property {(data: UserData|null) => void} updateUserData - Function to update the user data in context and localStorage.
 * @property {() => Promise<void>} refreshUserData - Function to fetch the latest user data from the server.
 */

/**
 * React Context for managing user authentication state and data.
 * Provides user data, functions to update it, and a function to refresh it from the server.
 * @type {React.Context<UserContextType|undefined>}
 */
const UserContext = createContext(undefined);

/**
 * Provider component for the UserContext.
 * Manages the user data state and provides context values to children.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The UserProvider component.
 */
export const UserProvider = ({ children }) => {
  /**
   * State holding the current user's data.
   * Initialized from localStorage if available.
   * @type {[UserData|null, React.Dispatch<React.SetStateAction<UserData|null>>]}
   */
  const [userData, setUserData] = useState(() => {
    // Try to get initial data from localStorage on component mount
    const storedData = localStorage.getItem('userData');
    try {
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      localStorage.removeItem('userData'); // Clear corrupted data
      return null;
    }
  });

  /**
   * Updates the user data state and persists it to localStorage.
   * @param {UserData|null} data - The new user data object, or null to clear data.
   */
  const updateUserData = (data) => {
    setUserData(data);
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
    } else {
      // If data is null or undefined, remove the item from localStorage
      localStorage.removeItem('userData');
    }
  };

  /**
   * Refreshes user data by fetching the latest profile information and entry stats
   * from the backend API. Requires a valid JWT token in localStorage.
   * Updates the context state upon successful fetch.
   * @returns {Promise<void>} A promise that resolves when the refresh attempt is complete.
   */
  const refreshUserData = async () => {
    console.log("Attempting to refresh user data...");
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found, cannot refresh.");
        // Optionally clear existing user data if token is missing
        // updateUserData(null);
        return;
      }

      // Object to aggregate refreshed data from different API calls
      let refreshedData = {};

      // --- Fetch Core User Profile Data ---
      // Fetches basic user details like name, email, and profile image.
      try {
        console.log("Fetching /api/users/me...");
        const profileResponse = await axios.get('http://localhost:5001/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile response:', profileResponse.data);
        if (profileResponse.data) {
          // Store essential profile data
          refreshedData.firstName = profileResponse.data.firstName;
          refreshedData.lastName = profileResponse.data.lastName;
          refreshedData.email = profileResponse.data.email;
          refreshedData.image = profileResponse.data.image;
        } else {
           console.log("No data received from /api/users/me");
        }
      } catch (error) {
        console.error('Error fetching user profile data:', error.response ? error.response.data : error.message);
        // Decide how to handle profile fetch errors.
        // Maybe clear user data or redirect to login if unauthorized (401)?
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access during profile fetch. Clearing token and data.");
          localStorage.removeItem('token');
          updateUserData(null); // Clear user data in context/localStorage
          // Consider redirecting to login page here
        }
        // For now, we proceed, potentially with incomplete data if other fetches succeed.
      }

      // --- Fetch Entries Count and Last Entry Date ---
      // Fetches all entries to determine the count and the date of the most recent one.
      try {
        console.log("Fetching /entries...");
        const entriesResponse = await axios.get('http://localhost:5001/entries', {
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
        });
        const entries = entriesResponse.data?.data; // Assuming API returns { data: [...] }

        // Calculate entries count
        refreshedData.entriesCount = entries?.length || 0;

        // Determine the most recent entry date
        if (entries && entries.length > 0) {
          // IMPORTANT: Assumes the backend sorts entries by createdAt descending.
          // If not, manual sorting or finding the max date is required here.
          // Example of finding max date if unsorted:
          // const latestDate = entries.reduce((max, entry) => {
          //   const entryDate = new Date(entry.createdAt);
          //   return entryDate > new Date(max) ? entry.createdAt : max;
          // }, entries[0].createdAt);
          // refreshedData.lastEntryDate = latestDate;

          // Using the first entry assuming backend sorts newest first
          refreshedData.lastEntryDate = entries[0].createdAt;
        } else {
          refreshedData.lastEntryDate = null; // No entries, so no last entry date
        }
      } catch (error) {
        console.error('Error fetching entries:', error.response ? error.response.data : error.message);
        // Default entries count to 0 and last date to null on error
        refreshedData.entriesCount = refreshedData.entriesCount ?? 0; // Keep existing count if profile fetch worked
        refreshedData.lastEntryDate = refreshedData.lastEntryDate ?? null; // Keep existing date if profile fetch worked
        // Handle specific errors like 401 similarly to profile fetch if needed
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access during entries fetch. Clearing token and data.");
          localStorage.removeItem('token');
          updateUserData(null);
        }
      }

      // --- Update Context State ---
      // Only update if we have fetched some data (check if refreshedData is not empty)
      if (Object.keys(refreshedData).length > 0) {
        console.log("Updating user data in context:", refreshedData);
        // Merge with existing data *if* necessary, or replace entirely.
        // Current implementation replaces entirely with fetched data.
        updateUserData(refreshedData);
      } else {
        console.log("No data was successfully refreshed.");
      }
    } catch (error) {
      // Catch any unexpected errors during the refresh process
      console.error('Unexpected error during user data refresh:', error);
      // Consider clearing data or showing an error message to the user
    }
  };

  // Provide the context value to consuming components
  return (
    <UserContext.Provider value={{ userData, updateUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to consume the UserContext.
 * Provides an easy way to access user data and actions.
 * Throws an error if used outside of a UserProvider.
 *
 * @returns {UserContextType} The user context value.
 * @throws {Error} If the hook is not used within a UserProvider.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Changed check to undefined as initial context value is undefined
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
