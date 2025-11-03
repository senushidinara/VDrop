// services/musicService.ts

/**
 * Simulates a music generation service.
 * In a real-world application, this would call a generative music API. Here, we analyze
 * the prompt for keywords and return a URL to a pre-selected, thematic audio track.
 * This provides a dynamic-feeling musical score for the manifested concept trailer.
 * The audio files are hosted on a stable public CDN.
 * 
 * @param prompt The user's core vision prompt.
 * @returns A string representing the URL to the selected music file.
 */
export const generateMusic = (prompt: string): string => {
    const lowercasedPrompt = prompt.toLowerCase();
    const base_url = 'https://storage.googleapis.com/aai-web-template-files';

    // Keyword-based theme selection
    if (lowercasedPrompt.includes('epic') || lowercasedPrompt.includes('battle') || lowercasedPrompt.includes('adventure')) {
        return `${base_url}/epic-score.mp3`;
    }
    if (lowercasedPrompt.includes('calm') || lowercasedPrompt.includes('serene') || lowercasedPrompt.includes('meditative') || lowercasedPrompt.includes('forest')) {
        return `${base_url}/ambient-nature.mp3`;
    }
    if (lowercasedPrompt.includes('cyberpunk') || lowercasedPrompt.includes('futuristic') || lowercasedPrompt.includes('sci-fi') || lowercasedPrompt.includes('neon')) {
        return `${base_url}/futuristic-synth.mp3`;
    }
    if (lowercasedPrompt.includes('dark') || lowercasedPrompt.includes('horror') || lowercasedPrompt.includes('suspense') || lowercasedPrompt.includes('ominous')) {
        return `${base_url}/dark-drone.mp3`;
    }

    // Default track if no keywords match
    return `${base_url}/inspirational-theme.mp3`;
};
