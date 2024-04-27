import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


const SingleEntry = () => {
    const [info, setInfo] = useState([]);
    

    const { id } = useParams();

   
    const getEntry = async () => {
        const  {data}  = await axios.get(`http://localhost:3333/entries/${id}`)
            // { headers: { Accept: 'application/json' } });
        console.log("axios single Get ->", data);
        const dataArr = [];
        for( let prop in data){
            // console.log([prop,data[prop]]);
            dataArr.push([prop,data[prop]])
        };
        console.log('dataArr->',dataArr);
        setInfo(dataArr);
        // console.log("info ->", info);
    };

    useEffect(  () => {
       getEntry();
    }, [])

    const entryData = info.map( el => {
        return (
            <div className="border-4 border-indigo-500">
                {el[0]} :  
                <br/>
                {el[1]}
            </div>
        )
    })
    return (
        <div>
            SingleEntry {id} 
            <br />
            {entryData}
           
        </div>

    )
}

export default SingleEntry