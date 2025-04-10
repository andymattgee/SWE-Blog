import React, { useState } from 'react';

/**
 * EntryImage Component for rendering entry images with error handling
 * 
 * @param {Object} props - Component props
 * @param {string} props.imagePath - Path to the image
 * @returns {JSX.Element} The image element
 */
const EntryImage = ({ imagePath }) => {
    const [error, setError] = useState(false);

    if (!imagePath) {
        return (
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image</span>
            </div>
        );
    }

    // Handle local preview (data URL)
    if (typeof imagePath === 'object' && imagePath.isLocal) {
        return (
            <img
                src={imagePath.url}
                alt="Entry preview"
                className="w-full h-64 object-cover rounded-lg"
                onError={() => setError(true)}
            />
        );
    }

    // Handle S3 URL
    const imageUrl = typeof imagePath === 'object' ? imagePath.url : imagePath;

    if (error) {
        return (
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Failed to load image</span>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt="Entry"
            className="w-full h-64 object-cover rounded-lg"
            onError={() => setError(true)}
        />
    );
};

export default EntryImage; 