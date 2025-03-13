import React, { useState, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPaperPlane, FaImage, FaTimes } from 'react-icons/fa';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.match('image.*')) {
            toast.error('Please select an image file');
            return;
        }

        // Check file size (limit to 4MB)
        if (file.size > 4 * 1024 * 1024) {
            toast.error('Image size should be less than 4MB');
            return;
        }

        setSelectedImage(file);

        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClearChat = () => {
        setChatHistory([]);
        setMessage('');
        setResponse('');
        removeSelectedImage();
    };

    const handleSendMessage = async () => {
        if (!message.trim() && !selectedImage) {
            toast.warning('Please enter a message or select an image');
            return;
        }

        setLoading(true);

        // Create form data for multipart/form-data request
        const formData = new FormData();
        formData.append('message', message);

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        // Add user message to chat history
        const userMessageContent = message.trim()
            ? message
            : 'Sent an image for analysis';

        // Add user message with image preview if available
        const userMessage = {
            role: 'user',
            content: userMessageContent,
            imageUrl: imagePreview // Store image preview URL in chat history
        };

        setChatHistory(prev => [...prev, userMessage]);

        try {
            console.log('Sending message to API with image:', selectedImage ? selectedImage.name : 'No image');

            // Use axios to send formData
            const { data } = await axios.post('http://localhost:3333/api/chat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Add AI response to chat history
            const aiResponse = { role: 'assistant', content: data.response };
            setChatHistory(prev => [...prev, aiResponse]);

            setResponse(data.response);
            toast.success('Response received!');
        } catch (error) {
            console.error('Error in chat request:', error);

            // Handle different error scenarios
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data.message || error.response.data.error || 'Server error';
                toast.error(`Error: ${errorMessage}`);
                setResponse(`Error: ${errorMessage}`);
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('No response from server. Please check your connection.');
                setResponse('Error: No response from server');
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error(`Error: ${error.message}`);
                setResponse(`Error: ${error.message}`);
            }

            // Add error message to chat history
            setChatHistory(prev => [...prev, {
                role: 'system',
                content: 'Error: Failed to get response from AI'
            }]);
        }

        setLoading(false);
        setMessage(''); // Clear input field after sending
        removeSelectedImage(); // Clear selected image
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-800">
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-3xl flex justify-between items-center mb-6">

                    <h1 className="text-3xl font-bold mb-6 text-white">Chat with GPT-4 Vision</h1>
                    <button onClick={handleClearChat} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                        Clear Chat
                    </button>
                </div>
                <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {/* Chat history display */}
                    <div className="h-[60vh] overflow-y-auto p-4 space-y-4" id="chat-container">
                        {chatHistory.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                <p>Start a conversation with the AI</p>
                                <p className="text-sm mt-2">Try asking a question, uploading an image, or requesting information</p>
                            </div>
                        ) : (
                            chatHistory.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${msg.role === 'user'
                                            ? 'bg-purple-600 text-white ml-auto max-w-[80%]'
                                            : msg.role === 'assistant'
                                                ? 'bg-gray-700 text-white max-w-[80%]'
                                                : 'bg-red-500 text-white max-w-[80%]'
                                        }`}
                                >
                                    {/* Display image if present */}
                                    {msg.imageUrl && (
                                        <div className="mb-2">
                                            <img
                                                src={msg.imageUrl}
                                                alt="User uploaded"
                                                className="rounded-md max-h-48 max-w-full"
                                            />
                                        </div>
                                    )}
                                    {/* Display message content */}
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="bg-gray-700 text-white p-3 rounded-lg max-w-[80%] flex items-center space-x-2">
                                <div className="animate-pulse">Thinking</div>
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Image preview area */}
                    {imagePreview && (
                        <div className="p-2 bg-gray-900 border-t border-gray-700">
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-20 rounded-md"
                                />
                                <button
                                    onClick={removeSelectedImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input area */}
                    <div className="p-4 bg-gray-900 border-t border-gray-700">
                        <div className="flex space-x-2">
                            <textarea
                                className="flex-grow p-3 text-white bg-gray-800 rounded-md border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none"
                                placeholder="Type your message or upload an image..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                rows={2}
                                disabled={loading}
                            />

                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                            />

                            {/* Image upload button */}
                            <button
                                className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                onClick={triggerFileInput}
                                disabled={loading}
                                title="Upload Image"
                            >
                                <FaImage />
                            </button>

                            {/* Send button */}
                            <button
                                className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                                onClick={handleSendMessage}
                                disabled={loading || (!message.trim() && !selectedImage)}
                                title="Send Message"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Press Enter to send, Shift+Enter for new line. Images up to 4MB supported.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default Chatbot;