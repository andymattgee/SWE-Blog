import React, { useState, useRef, useEffect } from 'react'; // Added useEffect
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
    const chatContainerRef = useRef(null); // Ref for chat container

    // Scroll to bottom of chat history
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error('Image size should be less than 4MB');
            return;
        }

        setSelectedImage(file);

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

        const formData = new FormData();
        formData.append('message', message);

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        const userMessageContent = message.trim()
            ? message
            : 'Sent an image for analysis';

        const userMessage = {
            role: 'user',
            content: userMessageContent,
            imageUrl: imagePreview 
        };

        setChatHistory(prev => [...prev, userMessage]);
        setMessage(''); // Clear input immediately after adding to history
        removeSelectedImage(); // Clear image immediately

        try {
            console.log('Sending message to API with image:', selectedImage ? 'Yes' : 'No'); // Simplified log

            const { data } = await axios.post('http://localhost:3333/api/chat', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const aiResponse = { role: 'assistant', content: data.response };
            setChatHistory(prev => [...prev, aiResponse]);

            setResponse(data.response);
            // toast.success('Response received!'); // Maybe remove this for less noise
        } catch (error) {
            console.error('Error in chat request:', error);
            let errorMessage = 'Failed to get response from AI';
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || 'Server error';
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = error.message;
            }
            toast.error(`Error: ${errorMessage}`);
            setResponse(`Error: ${errorMessage}`);
            setChatHistory(prev => [...prev, {
                role: 'system',
                content: `Error: ${errorMessage}`
            }]);
        } finally { // Use finally to ensure loading is always set to false
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        // Light: white bg; Dark: original gradient
        <div className="min-h-screen flex flex-col bg-white dark:bg-gradient-to-br dark:from-black dark:to-purple-900">
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} theme="colored" /> {/* Use colored theme */}

            <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
                <div className="w-full max-w-3xl flex justify-between items-center mb-6">
                    {/* Light: dark text; Dark: white text */}
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chat with GPT-4 Vision</h1>
                    <button onClick={handleClearChat} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                        Clear Chat
                    </button>
                </div>
                {/* Light: light gray bg; Dark: original dark gray bg */}
                <div className="w-full max-w-3xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-transparent flex flex-col"> {/* Added flex flex-col */}
                    {/* Chat history display */}
                    <div ref={chatContainerRef} className="flex-grow h-[60vh] overflow-y-auto p-4 space-y-4" id="chat-container"> {/* Added flex-grow */}
                        {chatHistory.length === 0 ? (
                            // Light: medium gray text; Dark: light gray text
                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                <p>Start a conversation with the AI</p>
                                <p className="text-sm mt-2">Try asking a question, uploading an image, or requesting information</p>
                            </div>
                        ) : (
                            chatHistory.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-lg ${msg.role === 'user'
                                            ? 'bg-purple-500 text-white ml-auto max-w-[80%]' // User: Light purple bg
                                            : msg.role === 'assistant'
                                                ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white max-w-[80%]' // Assistant: Light gray bg light, dark gray bg dark
                                                : 'bg-red-500 text-white max-w-[80%]' // System: Keep red
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
                                    <div className="whitespace-pre-wrap break-words">{msg.content}</div> {/* Added break-words */}
                                </div>
                            ))
                        )}
                        {loading && (
                            // Loading: Light gray bg light, dark gray bg dark
                            <div className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white p-3 rounded-lg max-w-[80%] flex items-center space-x-2">
                                <div className="animate-pulse">Thinking</div>
                                <div className="flex space-x-1">
                                    {/* Loading dots: Dark in light mode, white in dark mode */}
                                    <div className="w-2 h-2 bg-gray-700 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-700 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-700 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Image preview area */}
                    {imagePreview && (
                        // Image Preview: Lighter bg and border in light mode
                        <div className="p-2 bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
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
                    {/* Input Area: Lighter bg and border in light mode */}
                    <div className="p-4 bg-gray-200 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
                        <div className="flex space-x-2">
                            {/* Textarea: Light bg, dark text, light border in light mode */}
                            <textarea
                                className="flex-grow p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none"
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
                        {/* Helper text: Darker gray in light mode */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Press Enter to send, Shift+Enter for new line. Images up to 4MB supported.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer pushed to bottom */}
            <div className="mt-auto"> 
                <Footer />
            </div>
        </div>
    );
};

export default Chatbot;