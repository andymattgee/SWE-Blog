import React, { useState, useEffect } from 'react';
import axios from "axios";


const Entries = () => {
    const [entries, setEntries] = useState([]);
    const [title, setTitle] = useState('');
    const [profContent, setProfContent] = useState('');
    const [persContent, setPersContent] = useState('');


    const getEntries = async () => {
        const { data } = await axios.get('http://localhost:3333/entries',
            { headers: { Accept: 'application/json' } });
        console.log('axios entry data ->', data.data);
        setEntries(data.data);
    }
    useEffect(() => {
        getEntries();
    }, []);


    const deleteEntry = async (id) => {
        //window pop up that checks to make sure you want to delete the entry 
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await axios.delete(`http://localhost:3333/entries/${id}`);
                console.log("Entry deleted with id:", id);
                getEntries();
            } catch (error) {
                console.error("Error deleting entry:", error);
                // Handle error scenarios here, potentially setting an error state to show to the user.
            }
        }

    };

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
            getEntries();
        } catch (error) {
            console.log('error in post req ->'. error);
        }
    };

    const newEntries = entries.map(({ _id, title, createdAt, personalContent, professionalContent }) => {
        return (

            <div key={_id}
            style={{border:'solid'}}>
                <ul>
                    <li>Title: {title}</li>
                    <li>Date & Time: {createdAt}</li>
                    <li>Professional: <br/>{professionalContent}</li>
                    <li>Personal: <br/>{personalContent}</li>
                </ul>
                <button onClick={() => deleteEntry(_id)}>Delete post above</button>
            </div>
        )
        //.reverse to prepend entries to top, sure there's a better way but i'm tired right now
    }).reverse();

    return (
        <div>Entries here:
            {newEntries}
            <br/>
            <br/>
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

export default Entries;