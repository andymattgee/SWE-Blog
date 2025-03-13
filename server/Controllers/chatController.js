require('dotenv').config();
const {OpenAI} = require('openai');

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Controller to handle chat requests to OpenAI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatResponse = async (req, res) => {
    try {
        console.log('Received chat request:', req.body);
        
        // Validate request body
        const userMessage = req.body.message;
        if(!userMessage) {
            console.log('No message provided in request');
            return res.status(400).json({ error: 'No message provided' });
        }
        
        // Call OpenAI API
        console.log('Calling OpenAI API with message:', userMessage);
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: userMessage}],
            temperature: 0.7,
            max_tokens: 150, // Increased token limit for more detailed responses
        });
        
        // Log and return successful response
        console.log('OpenAI response received:', response.choices[0].message.content);
        return res.status(200).json({ 
            response: response.choices[0].message.content,
            success: true
        });
    } catch (error) {
        // Detailed error logging
        console.error('Error getting OpenAI response:', error);
        
        // Check for specific error types
        if (error.response) {
            console.error('OpenAI API error status:', error.response.status);
            console.error('OpenAI API error data:', error.response.data);
            return res.status(error.response.status).json({ 
                error: 'OpenAI API error', 
                message: error.response.data.error?.message || 'Unknown API error'
            });
        } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            return res.status(503).json({ error: 'Service unavailable', message: 'Could not connect to OpenAI' });
        }
        
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};

module.exports = {
    getChatResponse
};
