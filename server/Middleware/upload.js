/**
 * Middleware for handling file uploads using multer-s3 for AWS S3 storage.
 * Configures AWS SDK, sets up S3 storage with multer-s3, defines file filtering
 * for images, and exports the configured multer instance for use in routes.
 */

const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Configure AWS SDK with credentials and region from environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Create an S3 service object instance
const s3 = new AWS.S3();

/**
 * Configure multer-s3 storage engine.
 * Specifies the S3 instance, bucket name, content type detection,
 * metadata extraction, and key generation logic for uploaded files.
 */
const storage = multerS3({
    s3: s3, // S3 service object
    bucket: process.env.AWS_BUCKET_NAME, // S3 bucket name from environment variables
    contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type
    /**
     * Defines metadata to be stored with the S3 object.
     * @param {object} req - The Express request object.
     * @param {object} file - The file object being uploaded.
     * @param {function} cb - Callback function to set metadata.
     */
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname }); // Store the original field name as metadata
    },
    /**
     * Defines the key (filename) for the uploaded file in the S3 bucket.
     * Generates a unique filename using timestamp, random number, and original extension.
     * @param {object} req - The Express request object.
     * @param {object} file - The file object being uploaded.
     * @param {function} cb - Callback function to set the key.
     */
    key: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Generate unique suffix
        // Construct the key with 'images/' prefix, unique suffix, and original file extension
        cb(null, 'images/' + uniqueSuffix + path.extname(file.originalname));
    }
});

/**
 * Filter function for multer to allow only image files.
 * Checks the mimetype of the uploaded file.
 * @param {object} req - The Express request object.
 * @param {object} file - The file object being uploaded.
 * @param {function} cb - Callback function to indicate acceptance or rejection.
 */
const fileFilter = (req, file, cb) => {
    // Check if the file's mimetype starts with 'image/'
    if (!file.mimetype.startsWith('image/')) {
        // Reject file if it's not an image
        return cb(new Error('Only image files are allowed!'), false);
    }
    // Accept file if it's an image
    cb(null, true);
};

/**
 * Create and configure the multer upload middleware instance.
 * Uses the configured S3 storage engine, image file filter, and sets a file size limit.
 */
const upload = multer({
    storage: storage, // Use the configured S3 storage
    fileFilter: fileFilter, // Use the image file filter
    limits: {
        fileSize: 5 * 1024 * 1024 // Set file size limit to 5MB
    }
});

// Export the configured multer middleware instance
module.exports = upload;
