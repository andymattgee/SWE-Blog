import React, { useState, useEffect } from 'react'
import axios from 'axios';

//API page, just a playground for working with 3rd party API's and testing axios/fetch requests

const APITestPage = () => {
    const [joke, setJoke] = useState("Axios Joke will appear here");
    const [joke2, setFetchJoke] = useState("Fetched joke will appear here");
    const [nbaStat, setNbaStat] = useState([]);

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
                console.log('top10 ->',topTen);
                const filteredList = topTen.map(({player_name,age,id,team}) => {
                    return {
                        name:player_name,
                        age,
                        team,
                        id,
                    }
                });
                console.log("filtered list ->", filteredList);
                setNbaStat(filteredList);
            })
    };

    const playerList = nbaStat.map(({name,age,team},idx) =>
        <div key={idx}>
            <p>{idx + 1}. {name} - Age: {age} - Team: {team}</p>
        </div>
    );

    return (
        <div>
            <h1>
                API test Page
            </h1>
            <button onClick={handleJokeClick}>
                Axios a joke!
            </button>
            <h4>
                {joke}
            </h4>
            <br></br>
            <button onClick={handleJokeClickFetch}>
                Fetch a random joke!
            </button>
            <h4>
                {joke2}
            </h4>
            <br></br>
            <button onClick={handleNBAClick}>
                Fetch NBA stat!
            </button>
            <h3>2023 NBA Scoring Leaders - Top 10</h3>
            <h4>
                {nbaStat.length ? playerList : "nbaStat will appear here"}
            </h4>
        </div>
    )
}

export default APITestPage