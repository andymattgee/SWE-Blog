const Entry = require('../Models/entry');
const DOMPurify = require('isomorphic-dompurify');
require('dotenv').config();

// Configure DOMPurify to allow specific HTML elements and attributes
const purifyConfig = {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'br'],
    ALLOWED_ATTR: []
};

/**
 * Adds a new entry for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const addEntry = async (req, res) => {
    try {
        console.log('Adding new entry with image:', req.file?.location);
        
        // Check for required fields
        if (!req.body.title || !req.body.professionalContent) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: title and professionalContent are required'
            });
        }

        // Create new entry object
        const newEntry = {
            title: req.body.title,
            professionalContent: DOMPurify.sanitize(req.body.professionalContent, purifyConfig),
            personalContent: req.body.personalContent ? DOMPurify.sanitize(req.body.personalContent, purifyConfig) : '',
            date: new Date(), // Ensure date is set to current time
            user: req.user._id,
            image: req.file ? req.file.location || req.file.filename : null // Handle both S3 and local paths
        };

        // Save entry to database
        const entry = await Entry.create(newEntry);
        
        console.log('Created new entry:', {
            id: entry._id,
            title: entry.title,
            date: entry.date,
            hasImage: !!entry.image,
            imagePath: entry.image
        });

        return res.status(201).json({
            success: true,
            data: entry
        });
    } catch (error) {
        console.error('Error creating entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Gets all entries for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getEntries = async (req, res) => {
    try {
        // Find all entries and sort by date in descending order (-1)
        const entries = await Entry.find({ user: req.user._id })
            .sort({ date: -1, _id: -1 }) // Sort by date first, then by _id as a tiebreaker
            .select('-__v'); // Exclude version field
        
        console.log(`Fetched ${entries.length} entries, sorted by date`);
        
        return res.status(200).json({
            success: true,
            data: entries
        });
    } catch (error) {
        console.error('Error fetching entries:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Gets a specific entry by ID for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getEntry = async (req, res) => {
    try {
        const entry = await Entry.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        }).select('-__v');

        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Entry not found'
            });
        }

        console.log('Fetched single entry:', {
            id: entry._id,
            title: entry.title,
            date: entry.date,
            hasImage: !!entry.image,
            imagePath: entry.image
        });

        return res.status(200).json({
            success: true,
            data: entry
        });
    } catch (error) {
        console.error('Error fetching entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

/**
 * Updates a specific entry by ID for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const updateEntry = async (req, res) => {
    try {
        console.log('Updating entry with image:', req.file?.location);
        
        const entry = await Entry.findOne({ _id: req.params.id, user: req.user._id });
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Entry not found'
            });
        }

        // Update entry fields
        const updates = {
            title: req.body.title,
            professionalContent: DOMPurify.sanitize(req.body.professionalContent, purifyConfig),
            personalContent: req.body.personalContent ? DOMPurify.sanitize(req.body.personalContent, purifyConfig) : '',
            date: req.body.date
        };

        // Update image only if a new file was uploaded
        if (req.file) {
            updates.image = req.file.location || req.file.filename; // Handle both S3 and local paths
        } else if (req.body.image === null) {
            // If image is explicitly set to null, remove it
            updates.image = null;
        }

        const updatedEntry = await Entry.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        console.log('Updated entry:', {
            id: updatedEntry._id,
            title: updatedEntry.title,
            date: updatedEntry.date,
            hasImage: !!updatedEntry.image,
            imagePath: updatedEntry.image
        });

        return res.status(200).json({
            success: true,
            data: updatedEntry
        });
    } catch (error) {
        console.error('Error updating entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
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
        const entry = await Entry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: 'Entry not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Entry deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting entry:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    addEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry
};