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
                <div className="bg-gray-900 border border-purple-500 rounded-lg shadow-lg overflow-hidden h-full transition duration-300 hover:bg-purple-900 hover:shadow-xl hover:shadow-gray-400/30 hover:border-gray-300 cursor-pointer">
                    <article className="h-full flex flex-col">
                        {entry.image ? (
                            <div className="h-40 overflow-hidden">
                                <EntryImage imagePath={entry.image} />
                            </div>
                        ) : (
                            <div className="h-40 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                                <span className="text-4xl text-white opacity-30">✍️</span>
                            </div>
                        )}
                        <div className="p-4 flex-grow flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-white truncate pr-2">{entry.title}</h3>
                                <span className="text-xs text-gray-300 whitespace-nowrap">{formattedDate}</span>
                            </div>
                            <div className="text-gray-300 text-sm line-clamp-3 flex-grow">
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