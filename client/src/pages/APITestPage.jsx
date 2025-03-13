import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Chatbot = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            toast.warning('Please enter a message');
            return;
        }

        setLoading(true);
        
        // Add user message to chat history
        const userMessage = { role: 'user', content: message };
        setChatHistory(prev => [...prev, userMessage]);
        
        try {
            console.log('Sending message to API:', message);
            const { data } = await axios.post('http://localhost:3333/api/chat', { message });
            
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
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-800">
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-6 text-white">Chat with OpenAI</h1>
                
                <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {/* Chat history display */}
                    <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
                        {chatHistory.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                <p>Start a conversation with the AI</p>
                                <p className="text-sm mt-2">Try asking a question or requesting information</p>
                            </div>
                        ) : (
                            chatHistory.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`p-3 rounded-lg max-w-[80%] ${
                                        msg.role === 'user' 
                                            ? 'bg-purple-600 text-white ml-auto' 
                                            : msg.role === 'assistant'
                                                ? 'bg-gray-700 text-white' 
                                                : 'bg-red-500 text-white'
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            ))
                        )}
                        {loading && (
                            <div className="bg-gray-700 text-white p-3 rounded-lg max-w-[80%] flex items-center space-x-2">
                                <div className="animate-pulse">Thinking</div>
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Input area */}
                    <div className="p-4 bg-gray-900 border-t border-gray-700">
                        <div className="flex space-x-2">
                            <textarea
                                className="flex-grow p-3 text-white bg-gray-800 rounded-md border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none"
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                rows={2}
                                disabled={loading}
                            />
                            <button
                                className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                                onClick={handleSendMessage}
                                disabled={loading || !message.trim()}
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
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