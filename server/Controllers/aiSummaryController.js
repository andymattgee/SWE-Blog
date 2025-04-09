const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Processes HTML content to extract clean text for the AI prompt
 * @param {string} htmlContent - HTML content from the Quill editor
 * @returns {string} - Clean text without HTML tags
 */
const cleanHtmlContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Basic HTML tag removal (a more robust implementation might use a library like cheerio)
    return htmlContent
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with spaces
        .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
        .trim();                  // Trim whitespace
};

/**
 * Generate summaries for entry content using OpenAI
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateSummary = async (req, res) => {
    try {
        const { professionalContent, personalContent, entryId } = req.body;
        
        if (!professionalContent) {
            return res.status(400).json({
                success: false,
                message: 'Professional content is required for summarization'
            });
        }
        
        if (!entryId) {
            return res.status(400).json({
                success: false,
                message: 'Entry ID is required for summarization'
            });
        }
        
        // Clean HTML content
        const cleanProfessionalContent = cleanHtmlContent(professionalContent);
        const cleanPersonalContent = cleanHtmlContent(personalContent || '');
        
        // Generate summaries using OpenAI
        const professionalSummary = await getSummary(cleanProfessionalContent, 'professional');
        
        // Only generate personal summary if personal content exists
        let personalSummary = null;
        if (cleanPersonalContent) {
            personalSummary = await getSummary(cleanPersonalContent, 'personal');
        }
        
        return res.status(200).json({
            success: true,
            data: {
                professionalSummary,
                personalSummary,
                entryId
            }
        });
        
    } catch (error) {
        console.error('Error generating AI summary:', error);
        
        // Format OpenAI-specific errors
        let errorMessage = 'Failed to generate summary';
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        
        return res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message
        });
    }
};

/**
 * Generate a summary using OpenAI API
 * @param {string} content - The content to summarize
 * @param {string} type - The type of content (professional or personal)
 * @returns {string} - The generated summary
 */
async function getSummary(content, type) {
    try {
        if (!content) return null;
        
        // If content is too long, truncate it to avoid token limits
        const maxLength = 16000; // Roughly ~4000 tokens
        const truncatedContent = content.length > maxLength 
            ? content.substring(0, maxLength) + "..." 
            : content;
        
        const contentType = type === 'professional' ? 'professional blog entry' : 'personal journal entry';
        
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo", // You can use gpt-4 if available for better results
            messages: [
                {
                    role: "system",
                    content: "You are a friendly and thoughtful assistant. Summarize the following professional blog entry in a warm and human tone. Focus on the key ideas and convey them clearly and concisely, as if you're helping someone quickly understand what was written.Give the response back in a list format. "
                  },
                {
                    role: "user",
                    content: truncatedContent
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });
        
        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error(`Error getting ${type} summary from OpenAI:`, error);
        throw new Error(`Failed to generate ${type} summary: ${error.message}`);
    }
}