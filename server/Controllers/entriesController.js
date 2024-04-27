// import { Entry } from '../Models/entry.js';
const Entry = require('../Models/entry');

const getEntries = async (req, res) => {
    try {
        const entries = await Entry.find();
        return res.status(200).json({
            success: true,
            count: entries.length,
            data: entries,
        })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching entries' })
    }
};

const getEntry = async (req, res) => {
    const { id } = req.params;
    try {
        const entry = await Entry.findById(id);
        if(!entry){
            return res.status(404).json({message: `Entry ${id} not found`})
        }
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({message: 'Error fetching entry'})
    }
}

const addEntry = async (req, res) => {
    try {
        if (!req.body.title || !req.body.professionalContent) {
            return res.status(500).send({
                message: 'Missing required data from entry'
            });
        }
        const newEntry = {
            title: req.body.title,
            professionalContent: req.body.professionalContent,
            personalContent: req.body.personalContent,
            date: req.body.date,
            createAt: req.body.createdAt,
            image: req.body.image
        };
        const entry = await Entry.create(newEntry);
        return res.status(200).json({
            success: true,
            message: `${entry.title} created inside DB`,
        });        
    } catch (error) {
        return res.status(500).json({
            message: 'Error adding entry to DB',
            errorMessage: error.message
        });
    }
};

const deleteEntry = async (req,res) =>{
    try {
        const {id} = req.params;
        const results = await Entry.findByIdAndDelete(id);
        if(!results){
            return res.status(400).json({
                message:'Entry not found in DB, check ID/parameters'
            })
        }
        return res.status(200).json({
            success: true,
            message: "Entry successfullly deleted!"
        })
    } catch (error) {
        return res.status(500).json({
            message:'Error deleting entry in DB',
            errorMessage: error.message
        })
    }
}
module.exports = {
    getEntries,
    getEntry,
    addEntry,
    deleteEntry
}