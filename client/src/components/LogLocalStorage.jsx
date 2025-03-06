import React from 'react';

// LogLocalStorage component for logging the contents of localStorage
const LogLocalStorage = () => {
  /**
   * Function to log the entire localStorage content to the console.
   * This can be useful for debugging purposes to see what data is stored.
   */
  const logLocalStorage = () => {
    console.log('local storage ->', localStorage); // Log the entire localStorage object
  };

  return (
    <div>
      {/* Button to trigger the logLocalStorage function when clicked */}
      <button 
        className='focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900' 
        onClick={logLocalStorage} // Call logLocalStorage on button click
      >
        Log localStorage Button
      </button>
    </div>
  );
};

export default LogLocalStorage;
