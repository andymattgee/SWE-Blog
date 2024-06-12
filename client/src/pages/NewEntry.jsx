import React,{useState,useEffect} from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/navbar';

const NewEntry = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [profContent, setProfContent] = useState('');
    const [persContent, setPersContent] = useState('');


    const handleSubmit =  async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post('http://localhost:3333/entries',{
                title,
                professionalContent: profContent,
                personalContent : persContent,
            },{
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('Entry submitted:', response.data);

            setTitle('');
            setProfContent('');
            setPersContent('');
            navigate('/Entries')
        } catch (error) {
            console.log('error in post req ->', error);
        }
    };

  return (
    <div>
<NavBar/>
    <div className="flex flex-col items-center justify-center w-screen">
        
        <h2 className='bg-gradient-to-l from-yellow-500 via-blue-500 to-indigo-500 text-transparent bg-clip-text text-4xl font-bold'>Create a new entry here</h2>
        <br/>
            <form 
            onSubmit={handleSubmit}
            className="w-8/12"
            >
            <div className="mb-4 ">
                <label htmlFor="title">Title: </label>
                <br/>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    
                    className="border-2 w-full"
                    />
            </div>
            <div className="mb-4">
                <label htmlFor="profContent">Professional Content: </label>
                <br/>
                <textarea
                    id="entry"
                    name="entry"
                    value={profContent}
                    onChange={(e) => setProfContent(e.target.value)}
                    required
                    rows={10}
                    
                    className="border-2 w-full p-4"
                    />
            </div>
            <div className="mb-4">
                <label htmlFor="persContent">Personal Content</label>
                <br/>
                <textarea
                    id="entry"
                    name="entry"
                    value={persContent}
                    onChange={(e) => setPersContent(e.target.value)}
                    required
                    rows={10}
                    
                    className="border-2 w-full p-4"
                    />
            </div>
            <div className="">
                <button 
                type="submit"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 h-20 w-full "
                >Submit Entry</button>
            </div>
        </form>
                </div>
    </div>
  )
}

export default NewEntry