// Function to process Quill content for display
export const processQuillContent = (content) => {
    if (!content) return '';

    // Simply return the content directly to preserve all HTML formatting
    // The dangerouslySetInnerHTML in the component will handle rendering it
    return content;
}; 