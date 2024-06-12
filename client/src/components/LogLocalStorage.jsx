import React from 'react';

const LogLocalStorage = () => {
  // Function to log localStorage content
  const logLocalStorage = () => {
    console.log('local storage ->', localStorage);
    // const allKeys = Object.keys(localStorage);
    // allKeys.forEach(key => {
    //   console.log(`${key}: ${localStorage.getItem(key)}`);
    // });
  };

  return (
    <div>
      <button className='focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900' onClick={logLocalStorage}>Log localStorage Button</button>
    </div>
  );
};

export default LogLocalStorage;
