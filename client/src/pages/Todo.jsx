import React, { useState } from 'react'
import NavBar from '../components/navbar'

const Todo = () => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Title: ${title}, Notes: ${notes}, Priority: ${priority}`);
    setTitle('');
    setNotes('');
    setPriority('');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">Todo Page</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-lg mb-2">
            Task/Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-lg"
            />
          </label>
          <br />
          <label className="text-lg mb-2">
            Priority:
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-lg"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <br />
          <label className="text-lg mb-2">
            Additional Notes:
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded-lg"
            />
          </label>
          <br />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-purple-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Todo;