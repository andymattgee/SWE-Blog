/**
 * Middleware for handling file uploads using multer.
 * This module configures multer to store uploaded images on the server.
 *
 * @module upload
 * @requires multer
 * @requires path
 *
 * @const {multer} multer - The multer library for handling multipart/form-data.
 * @const {Object} storage - Configuration for multer's disk storage.
 * @const {Function} fileFilter - Function to filter uploaded files.
 * @const {Object} upload - The multer upload middleware.
 *
 * @returns {multer.Multer} The configured multer upload middleware.
 */

const multer = require('multer');
const path = require('path');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder for uploaded images
    cb(null, path.join(__dirname, '../uploads/images'));
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filter function to only allow image files
const fileFilter = (req, file, cb) => {
  // Check if the file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Create the multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: fileFilter
});

module.exports = upload; // Export the upload middleware for use in routes
