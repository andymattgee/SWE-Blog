import React from 'react';
import EntryImage from './EntryImage';
import { processQuillContent } from '../utils/contentUtils';

/**
 * EntryCard Component
 * Displays a single blog entry in a card format for the grid view.
 * 
 * @param {Object} props
 * @param {Object} props.entry - The entry data to display
 * @param {Function} props.onClick - Function to call when the card is clicked
 * @returns {JSX.Element} The entry card component
 */
const EntryCard = ({ entry, onClick }) => {
    const formattedDate = new Date(entry.createdAt).toLocaleDateString();

    return (
        <div className="col-span-1" onClick={() => onClick(entry)}>
            <div className="h-full">
                {/* Light: white bg, gray border, light hover; Dark: original styles */}
                {/* Light: white bg, gray border -> hover: larger purple shadow, purple border; Dark: original styles */}
                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-purple-500 rounded-lg shadow-md dark:shadow-lg overflow-hidden h-full transition duration-300 hover:shadow-xl hover:shadow-purple-400/50 dark:hover:bg-purple-900 dark:hover:shadow-xl dark:hover:shadow-gray-400/30 hover:border-purple-500 dark:hover:border-gray-300 cursor-pointer">
                    <article className="h-full flex flex-col">
                        {entry.image ? (
                            <div className="h-40 overflow-hidden">
                                <EntryImage imagePath={entry.image} />
                            </div>
                        ) : (
                            // Light: lighter gradient; Dark: original gradient
                            <div className="h-40 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                                {/* Light: gray icon; Dark: white icon */}
                                <span className="text-4xl text-gray-500 dark:text-white opacity-30">✍️</span>
                            </div>
                        )}
                        <div className="p-4 flex-grow flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                {/* Light: dark text; Dark: white text */}
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2">{entry.title}</h3>
                                {/* Light: medium gray text; Dark: light gray text */}
                                <span className="text-xs text-gray-500 dark:text-gray-300 whitespace-nowrap">{formattedDate}</span>
                            </div>
                            {/* Light: medium gray text; Dark: light gray text */}
                            <div className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 flex-grow">
                                <div dangerouslySetInnerHTML={{ __html: processQuillContent(entry.professionalContent) }} />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default EntryCard;