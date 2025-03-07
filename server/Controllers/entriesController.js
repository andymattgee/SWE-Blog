const Entry = require('../Models/entry'); // Import the Entry model

/**
 * Fetches all entries for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getEntries = async (req, res) => {
    try {
        // Retrieve entries associated with the current user
        const entries = await Entry.find({ user: req.user._id });
        return res.status(200).json({
            success: true,
            count: entries.length, // Count of entries retrieved
            data: entries, // The entries data
        });
    } catch (error) {
        // Handle errors during fetching
        res.status(500).json({ message: 'Error fetching entries' });
    }
};

/**
 * Fetches a specific entry by ID for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getEntry = async (req, res) => {
    const { id } = req.params; // Extract the entry ID from the request parameters
    try {
        // Find the entry by ID and ensure it belongs to the authenticated user
        const entry = await Entry.findOne({ _id: id, user: req.user._id });
        if (!entry) {
            return res.status(404).json({ message: `Entry ${id} not found` });
        }
        res.status(200).json([entry]); // Respond with the found entry
    } catch (error) {
        // Handle errors during fetching
        res.status(500).json({ message: 'Error fetching entry' });
    }
};

/**
 * Adds a new entry for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const addEntry = async (req, res) => {
    console.log('enter addEntry block');
    try {
        // Check for required fields in the request body
        if (!req.body.title || !req.body.professionalContent) {
            return res.status(400).send({
                message: 'Missing required data from entry'
            });
        }
        // Create a new entry object
        const newEntry = {
            title: req.body.title,
            professionalContent: req.body.professionalContent,
            personalContent: req.body.personalContent,
            date: req.body.date,
            createdAt: req.body.createdAt,
            image: req.body.image,
            user: req.user._id, // Associate entry with authenticated user
        };
        const entry = await Entry.create(newEntry); // Save the new entry to the database
        return res.status(201).json({
            success: true,
            message: `${entry.title} created inside DB`,
        });        
    } catch (error) {
        // Handle errors during adding
        return res.status(500).json({
            message: 'Error adding entry to DB',
            errorMessage: error.message
        });
    }
};

/**
 * Deletes a specific entry by ID for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params; // Extract the entry ID from the request parameters
        const results = await Entry.findOneAndDelete({ _id: id, user: req.user._id }); // Find and delete the entry
        if (!results) {
            return res.status(400).json({
                message: 'Entry not found in DB, check ID/parameters'
            });
        }
        return res.status(200).json({
            success: true,
            message: "Entry successfully deleted!"
        });
    } catch (error) {
        // Handle errors during deletion
        return res.status(500).json({
            message: 'Error deleting entry in DB',
            errorMessage: error.message
        });
    }
};

/**
 * Updates a specific entry by ID for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const updateEntry = async (req, res) => {
    const { id } = req.params; // Extract the entry ID from the request parameters
    const { title, professionalContent, personalContent } = req.body; // Extract fields to update

    try {
        // Find and update the entry, ensuring it belongs to the authenticated user
        const updatedEntry = await Entry.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { title, professionalContent, personalContent },
            { new: true, runValidators: true } // Return the updated entry and run validators
        );
        
        if (!updatedEntry) {
            return res.status(404).json({ message: `Entry ${id} not found` });
        }
        
        res.status(200).json({
            success: true,
            message: `${updatedEntry.title} updated successfully`,
            data: updatedEntry // Respond with the updated entry data
        });
    } catch (error) {
        // Handle errors during updating
        res.status(500).json({
            message: 'Error updating entry in DB',
            errorMessage: error.message
        });
    }
};

// Export the controller functions for use in routes
module.exports = {
    getEntries,
    getEntry,
    addEntry,
    deleteEntry,
    updateEntry
};