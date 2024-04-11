require('dotenv').config();

// import express from 'express';
// import mongoose from 'mongoose';
// import entriesRoute from './Routes/entriesRoute.js';
// import cors from 'cors';
// const { PORT, DB_URL, DB_NAME } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const entriesRoute = require('./Routes/entriesRoute.js');
const cors = require('cors');

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

const app = express();

//middleware that parses incoming JSON
app.use(express.json());

//should handle cors errors
app.use(cors());


app.get('/', (req, res) => {
    return res.status(200).send('backend 3333 page')
});

app.use('/entries', entriesRoute);


//connects to DB, if successfull then starts the server
//if not, logs the error
mongoose
    .connect(DB_URL, { dbName: DB_NAME})
    .then(() => {
        console.log('Connected to MongoDB...');
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`);
        });  
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

module.exports = app;