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
        
        // Ensure summaries are properly formatted as lists if they aren't already
        const formattedProfessionalSummary = ensureListFormat(professionalSummary);
        const formattedPersonalSummary = personalSummary ? ensureListFormat(personalSummary) : null;
        
        return res.status(200).json({
            success: true,
            data: {
                professionalSummary: formattedProfessionalSummary,
                personalSummary: formattedPersonalSummary,
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
 * Ensures text is in a consistent list format
 * @param {string} text - The text to format
 * @returns {string} - Text formatted as a list
 */
function ensureListFormat(text) {
    if (!text) return '';
    
    // Check if it's already in a list format
    const hasListMarkers = text.includes('- ') || text.includes('• ') || 
                           text.includes('* ') || /^\d+\.\s/.test(text);
    
    if (hasListMarkers) {
        return text; // Already a list, return as is
    }
    
    // If not in list format, convert to bullet points
    // First, split by sentences or paragraphs
    const lines = text.split(/(?<=[.!?])\s+/);
    
    // Convert each meaningful line to a bullet point
    return lines
        .filter(line => line.trim().length > 10) // Only include meaningful content
        .map(line => `- ${line.trim()}`)
        .join('\n');
}

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
        
        const systemPrompt = type === 'professional' 
            ? "You are a professional summarizer helping users understand blog content. Summarize the following content by extracting 5-7 key points. Format your response as a bulleted list using '-' at the start of each point. Focus on the main ideas, arguments, and conclusions. Be clear and concise."
            : "You are a thoughtful summarizer helping users understand personal content. Summarize the following journal entry by extracting 3-5 key points. Format your response as a bulleted list using '-' at the start of each point. Focus on the personal insights, feelings, and reflections. Be warm and empathetic.";
        
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo", // You can use gpt-4 if available for better results
            messages: [
                {
                    role: "system",
                    content: systemPrompt
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