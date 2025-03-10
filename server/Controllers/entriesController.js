const Entry = require('../Models/entry'); // Import the Entry model
const DOMPurify = require('isomorphic-dompurify'); // Import DOMPurify for HTML sanitization

// Configure DOMPurify to allow specific HTML elements and attributes
const purifyConfig = {
    ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ol', 'ul', 'li', 'div', 'span', 'pre', 'blockquote'
    ],
    ALLOWED_ATTR: [
        'style', 'class', 'spellcheck', 'data-gramm', 'data-placeholder',
        'data-label', 'link', 'list', 'bullet', 'indent', 'align', 'direction',
        'header', 'script', 'font', 'size'
    ],
    ALLOWED_CLASSES: [
        'ql-editor', 'ql-blank', 'ql-indent-*', 'ql-align-*', 'ql-direction-*',
        'ql-size-*', 'ql-font-*', 'ql-bg-*', 'ql-color-*', 'ql-list-*'
    ],
    ADD_TAGS: ['div'],
    ADD_ATTR: ['align', 'style'],
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: true
};

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
        console.error('Error fetching entries:', error);
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
        console.error('Error fetching entry:', error);
        res.status(500).json({ message: 'Error fetching entry' });
    }
};

/**
 * Adds a new entry for the authenticated user.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const addEntry = async (req, res) => {
    try {
        // Check for required fields in the request body
        if (!req.body.title || !req.body.professionalContent) {
            return res.status(400).send({
                message: 'Missing required data from entry'
            });
        }

        // Handle image file if uploaded
        let imagePath = null;
        if (req.file) {
            // Create the path to the uploaded image
            imagePath = `/uploads/images/${req.file.filename}`;
        }

        // Create a new entry object with sanitized content
        const newEntry = {
            title: req.body.title,
            professionalContent: DOMPurify.sanitize(req.body.professionalContent, { ...purifyConfig }),
            personalContent: DOMPurify.sanitize(req.body.personalContent, { ...purifyConfig }),
            date: req.body.date,
            createdAt: req.body.createdAt,
            image: imagePath,
            user: req.user._id, // Associate entry with authenticated user
        };

        const entry = await Entry.create(newEntry); // Save the new entry to the database
        return res.status(201).json({
            success: true,
            message: `${entry.title} created inside DB`,
            entry: entry
        });        
    } catch (error) {
        // Handle errors during adding
        console.error('Error adding entry to DB:', error);
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
        console.error('Error deleting entry in DB:', error);
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
    try {
        // Find the entry by ID and user ID
        const entry = await Entry.findOne({ _id: id, user: req.user._id });
        if (!entry) {
            return res.status(404).json({
                message: 'Entry not found'
            });
        }

        // Handle image file if uploaded
        let imagePath = entry.image; // Keep existing image by default
        if (req.file) {
            // Create the path to the uploaded image
            imagePath = `/uploads/images/${req.file.filename}`;
        } else if (req.body.image === null) {
            // If image is explicitly set to null, remove the image
            imagePath = null;
        }

        // Update the entry with sanitized content
        const updatedEntry = await Entry.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                professionalContent: DOMPurify.sanitize(req.body.professionalContent, { ...purifyConfig }),
                personalContent: DOMPurify.sanitize(req.body.personalContent, { ...purifyConfig }),
                date: req.body.date,
                image: imagePath
            },
            { new: true } // Return the updated document
        );

        return res.status(200).json({
            success: true,
            message: 'Entry updated successfully',
            entry: updatedEntry
        });
    } catch (error) {
        // Handle errors during updating
        console.error('Error updating entry:', error);
        return res.status(500).json({
            message: 'Error updating entry',
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