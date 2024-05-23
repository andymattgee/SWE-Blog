// import {model, Schema} from 'mongoose';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntrySchema = new Schema(
    {
        title: {type: String, required: true},
        professionalContent: {type: String, required: true},
        personalContent: {type: String, required: false},
        date: {type: Date, required: false},
        createdAt: {type: Date, default: Date.now},
        image: {type: String, required: false},
        user: [{type: Schema.Types.ObjectId, ref: 'User'}]
    }
);

const Entry = mongoose.model('Entry', EntrySchema);

module.exports = Entry;