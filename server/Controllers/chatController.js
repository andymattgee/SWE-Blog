require('dotenv').config();
const {OpenAI} = require('openai');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Process image with Sharp to convert to JPEG and compress if needed
 * @param {Buffer} imageBuffer - Original image buffer
 * @returns {Promise<Buffer>} - Processed image buffer
 */
const processImage = async (imageBuffer) => {
    try {
        // Get image metadata to check size and format
        const metadata = await sharp(imageBuffer).metadata();
        console.log('Original image metadata:', {
            format: metadata.format,
            width: metadata.width,
            height: metadata.height,
            size: `${imageBuffer.length / (1024 * 1024)} MB`
        });
        
        // Start with a quality of 80 for JPEG conversion
        let quality = 80;
        
        // If image is large, reduce quality further
        if (imageBuffer.length > 10 * 1024 * 1024) { // If over 10MB
            quality = 60;
        }
        
        // Convert to JPEG and resize if very large
        const sharpInstance = sharp(imageBuffer)
            .jpeg({ quality: quality });
            
        // If image dimensions are very large, resize while maintaining aspect ratio
        if (metadata.width > 2000 || metadata.height > 2000) {
            const resizeOptions = metadata.width > metadata.height 
                ? { width: 2000 } 
                : { height: 2000 };
                
            sharpInstance.resize(resizeOptions);
        }
        
        // Process the image
        const processedImageBuffer = await sharpInstance.toBuffer();
        
        // Log the size reduction
        console.log('Processed image size:', `${processedImageBuffer.length / (1024 * 1024)} MB`);
        
        return processedImageBuffer;
    } catch (error) {
        console.error('Error processing image with Sharp:', error);
        throw new Error('Failed to process image: ' + error.message);
    }
};

/**
 * Controller to handle chat requests to OpenAI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getChatResponse = async (req, res) => {
    try {
        console.log('Received chat request with body:', req.body);
        
        // Check if there's an image in the request
        const hasImage = req.file && req.file.buffer;
        
        // Validate request body
        const userMessage = req.body.message || '';
        
        if(!userMessage && !hasImage) {
            console.log('No message or image provided in request');
            return res.status(400).json({ error: 'No message or image provided' });
        }
        
        // Prepare messages array for OpenAI API
        let messages = [];
        
        if (hasImage) {
            console.log('Image detected in request');
            
            try {
                // Process the image with Sharp (convert to JPEG and compress)
                const processedImageBuffer = await processImage(req.file.buffer);
                
                // Convert processed image buffer to base64
                const base64Image = processedImageBuffer.toString('base64');
                const dataURI = `data:image/jpeg;base64,${base64Image}`;
                
                // Create content array with text and image
                const content = [
                    {
                        type: "text",
                        text: userMessage || "What's in this image?"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: dataURI
                        }
                    }
                ];
                
                // Add user message with image to messages array
                messages.push({
                    role: "user",
                    content: content
                });
                
                console.log('Using GPT-4 Turbo model for image analysis');
                
                // Call OpenAI API with GPT-4 Turbo model
                const response = await openai.chat.completions.create({
                    model: "gpt-4-turbo",
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7,
                });
                
                // Log and return successful response
                console.log('OpenAI GPT-4 Turbo response received');
                return res.status(200).json({ 
                    response: response.choices[0].message.content,
                    success: true
                });
            } catch (imageError) {
                console.error('Error processing image:', imageError);
                return res.status(400).json({ 
                    error: 'Image processing error', 
                    message: imageError.message 
                });
            }
        } else {
            // Text-only request
            console.log('Text-only request detected');
            
            // Add user message to messages array
            messages.push({
                role: "user",
                content: userMessage
            });
            
            // Call OpenAI API with GPT-3.5 Turbo model
            console.log('Calling OpenAI API with text message:', userMessage);
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
            });
            
            // Log and return successful response
            console.log('OpenAI response received');
            return res.status(200).json({ 
                response: response.choices[0].message.content,
                success: true
            });
        }
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
        } else if (error.message.includes('Only image files are allowed')) {
            return res.status(400).json({ error: 'Invalid file type', message: 'Only image files are allowed' });
        }
        
        return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
};

module.exports = {
    getChatResponse
};
