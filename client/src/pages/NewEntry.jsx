import React,{useState,useEffect} from 'react';
import {Link,Route,Routes,Navigate,useNavigate} from 'react-router-dom';
import axios from 'axios';


const NewEntry = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [profContent, setProfContent] = useState('');
    const [persContent, setPersContent] = useState('');


    const handleSubmit =  async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3333/entries',{
                title,
                professionalContent: profContent,
                personalContent : persContent
            });
            console.log('Entry submitted:', response.data);

            setTitle('');
            setProfContent('');
            setPersContent('');
            navigate('/Entries')
            // getEntries();
        } catch (error) {
            console.log('error in post req ->', error);
        }
    };

  return (
    
    <div>
        <h2>

        New Entry page here
        </h2>
        <h2>Create a new entry here</h2>
            <form 
            onSubmit={handleSubmit}
            >
            <div>
                <label htmlFor="title">Title: </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ width: "50%", maxWidth: "50%" }}
                />
            </div>
            <div>
                <label htmlFor="profContent">Professional Content</label>
                <textarea
                    id="entry"
                    name="entry"
                    value={profContent}
                    onChange={(e) => setProfContent(e.target.value)}
                    required
                    rows={20}
                    style={{ width: "90%", maxWidth: "90%" }}
                />
            </div>
            <div>
                <label htmlFor="persContent">Personal Content</label>
                <textarea
                    id="entry"
                    name="entry"
                    value={persContent}
                    onChange={(e) => setPersContent(e.target.value)}
                    required
                    rows={20}
                    style={{ width: "90%", maxWidth: "90%" }}
                />
            </div>
            <div>
                <button type="submit">Submit Entry</button>
            </div>
        </form>
    </div>
  )
}

export default NewEntry