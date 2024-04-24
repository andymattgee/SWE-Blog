import React from 'react'
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';


const Home = () => {

  const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('/test1');
    }
    const handleClick2 = () => {
        navigate('/test2');
    }
    const handleAPIClick = () => {
        navigate('/APITestPage');
    }
    const handleViewEntries = ()=> {
        navigate('/Entries')
    }

  return (
    <div >
      
        <h2 className="bg-gradient-to-br from-orange-500 via-indigo-500 to-green-500 text-transparent bg-clip-text text-6xl font-bold text-center">
            Currently in home component
        </h2>
        <button className="mt-20 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm h-20 px-10 py-2.5 text-center me-2 mb-2 "
        onClick={handleClick}>Button to Test1</button>
        <br></br>
        <button onClick={handleClick2}>Button to Test2</button>
        <br></br>
        <button onClick={handleAPIClick}>Button to API test Page </button>
        <br/>
        <button onClick ={handleViewEntries}>View Entries</button>
    </div>
    
  )
}

export default Home