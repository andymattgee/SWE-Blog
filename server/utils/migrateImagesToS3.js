/**
 * Utility script to migrate existing local image paths to S3
 * This script finds all entries with local image paths and uploads those images to S3
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const Entry = require('../Models/entry');

// MongoDB connection details
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'swe-blog';

// Configure AWS with credentials from environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Create S3 service object
const s3 = new AWS.S3();

/**
 * Uploads a file to S3 and returns the S3 URL
 * @param {string} filePath - Path to the file on the local filesystem
 * @param {string} fileName - Name to use for the file in S3
 * @returns {Promise<string>} - The S3 URL for the uploaded file
 */
async function uploadFileToS3(filePath, fileName) {
    try {
        // Read the file from the filesystem
        const fileContent = fs.readFileSync(filePath);
        
        // Set up the S3 upload parameters
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `images/${fileName}`,
            Body: fileContent,
            ContentType: getContentType(filePath),
            // Remove ACL setting as newer buckets have ACLs disabled
            // ACL: 'public-read'
        };
        
        // Upload the file to S3
        const data = await s3.upload(params).promise();
        console.log(`File uploaded successfully. S3 URL: ${data.Location}`);
        return data.Location;
    } catch (error) {
        console.error(`Error uploading file to S3: ${error.message}`);
        throw error;
    }
}

/**
 * Determines the content type based on file extension
 * @param {string} filePath - Path to the file
 * @returns {string} - The content type
 */
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
}

/**
 * Migrates all entries with local image paths to use S3 URLs
 */
async function migrateImagesToS3() {
    try {
        // Connect to MongoDB
        await mongoose.connect(DB_URL, { dbName: DB_NAME });
        console.log('Connected to MongoDB');
        
        // Find all entries with local image paths
        const entries = await Entry.find({
            image: { $regex: '^/uploads/' }
        });
        
        console.log(`Found ${entries.length} entries with local image paths`);
        
        // Process each entry
        for (const entry of entries) {
            try {
                // Get the local file path
                const localPath = entry.image;
                const fileName = path.basename(localPath);
                const fullPath = path.join(__dirname, '..', localPath);
                
                console.log(`Processing entry ${entry._id} with image ${localPath}`);
                
                // Check if the file exists
                if (fs.existsSync(fullPath)) {
                    // Upload the file to S3
                    const s3Url = await uploadFileToS3(fullPath, fileName);
                    
                    // Update the entry with the S3 URL
                    entry.image = s3Url;
                    await entry.save();
                    
                    console.log(`Updated entry ${entry._id} with S3 URL ${s3Url}`);
                } else {
                    console.warn(`File ${fullPath} does not exist, skipping entry ${entry._id}`);
                    
                    // For entries with missing files, set image to null
                    entry.image = null;
                    await entry.save();
                    console.log(`Updated entry ${entry._id} to have null image since file was missing`);
                }
            } catch (error) {
                console.error(`Error processing entry ${entry._id}: ${error.message}`);
            }
        }
        
        console.log('Migration completed');
    } catch (error) {
        console.error(`Migration failed: ${error.message}`);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

// Run the migration if this script is executed directly
if (require.main === module) {
    migrateImagesToS3()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { migrateImagesToS3 };
