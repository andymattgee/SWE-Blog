import React, { useState, useEffect } from 'react'
import axios from 'axios';
import NavBar from '../components/navbar';

//API page, just a playground for working with 3rd party API's and testing axios/fetch requests

const APITestPage = () => {
    const [joke, setJoke] = useState("Axios Joke will appear here");
    const [joke2, setFetchJoke] = useState("Fetched joke will appear here");
    const [nbaStat, setNbaStat] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');

    const jokeURL = "https://icanhazdadjoke.com/";

    //get request with axios
    const handleJokeClick = () => {
        axios.get(jokeURL,
            { headers: { Accept: 'application/json' } })
            .then(res => {
                // console.log('res joke ->', res.data.joke);
                setJoke(res.data.joke);
            })
    }

    //get request with built in fetch
    const handleJokeClickFetch = () => {
        fetch(jokeURL, {
            method: "GET",
            headers: {
                accept: 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log('fetched data ->',data);
                setFetchJoke(data.joke);
            });
    };

    //nba call w axios
    const handleNBAClick = () => {
        console.log('nba button clicked');
        axios.get("https://nba-stats-db.herokuapp.com/api/playerdata/topscorers/total/season/2023/",
            { headers: { Accept: 'application/json' } })
            .then(res => {
                // console.log('res NBA ->', res.data.results);
                const playerList = res.data.results;
                // const top40 = playerList.forEach((obj,idx) => console.log(obj))
                const topTen = playerList.filter((el, idx) => idx < 10);
                console.log('top10 ->', topTen);
                const filteredList = topTen.map(({ player_name, age, id, team }) => {
                    return {
                        name: player_name,
                        age,
                        team,
                        id,
                    }
                });
                console.log("filtered list ->", filteredList);
                setNbaStat(filteredList);
            })
    };
    const handleGetPlayerData = () => {
        console.log('clicked player data ->', selectedValue);
        }
        const handleDropDownChange = (event) => {
            setSelectedValue(event.target.value);
        }
    const playerList = nbaStat.map(({ name, age, team }, idx) =>
        <div key={idx}>
            <p>{idx + 1}. {name} - Age: {age} - Team: {team}</p>
        </div>
    );

    return (
        <div>
            <NavBar />
            <div className='flex flex-col justify-center h-screen items-center '>

                <h1>
                    API test Page
                </h1>

                <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    onClick={handleJokeClick}>
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Axios a joke!
                    </span>
                </button>
                <h4>
                    {joke}
                </h4>

                <br></br>

                <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    onClick={handleJokeClickFetch}>
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">

                        Fetch a random joke!
                    </span>
                </button>
                <h4>
                    {joke2}
                </h4>

                <br></br>

                <button
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400"
                    onClick={handleNBAClick}>
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">

                        2023 NBA Scoring Leaders
                    </span>
                </button>
                <h3>2023 NBA Scoring Leaders - Top 10</h3>
                <h4>
                    {nbaStat.length ? playerList : "nbaStat will appear here"}
                </h4>

                <div>
                    <select value={selectedValue}   onChange={handleDropDownChange}
                    className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                        <option value="">Select Player</option>
                        <option value="Lebron James">Lebron James</option>
                        <option value="Michael Jordan">Michael Jordan</option>
                        <option value="Kobe Bryant">Kobe Bryant</option>  
                        </select>
                </div>

                <button className="mt-20 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm h-20 px-10 py-2.5 text-center me-2 mb-1"
                onClick={handleGetPlayerData}>
                    NBA Test Button
                </button>
            </div>
        </div>
    )
}

export default APITestPage