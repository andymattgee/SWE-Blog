require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { PORT, DB_URL, DB_NAME } = process.env;

const app = express();


app.get('/', (req, res) => {
    return res.status(200).send('backend 3333 page')
});

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