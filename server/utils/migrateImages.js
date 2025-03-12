/**
 * Script to run the image migration utility
 */

const { migrateImagesToS3 } = require('./migrateImagesToS3');

console.log('Starting image migration process...');
migrateImagesToS3()
    .then(() => {
        console.log('Migration completed successfully');
        process.exit(0);
    })
    .catch(error => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
