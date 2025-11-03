import { ELEVENLABS_API_URL, VOICE_ID } from "../config";

// Get API key from environment
const getApiKey = (): string => {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
    if (!apiKey || apiKey === 'your_elevenlabs_api_key_here') {
        throw new Error("ElevenLabs API Key not configured. Please add your API key to the .env file.");
    }
    return apiKey;
};

/**
 * Generates narration audio from a given text string using the ElevenLabs Text-to-Speech API.
 */
export const generateNarration = async (text: string): Promise<string> => {
    try {
        const apiKey = getApiKey();
        const apiEndpoint = `${ELEVENLABS_API_URL}/v1/text-to-speech/${VOICE_ID}`;

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({
                detail: { message: `API request failed with status ${response.status}` }
            }));
            const errorMessage = errorBody.detail?.message || errorBody.message || `HTTP ${response.status}`;
            throw new Error(`ElevenLabs API Error: ${errorMessage}`);
        }

        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);

    } catch (error: any) {
        console.error("Error generating narration:", error);

        if (error.message.includes('API Key not configured')) {
            throw error;
        }

        throw new Error(error.message || "Failed to generate narration. Please check your API key and network connection.");
    }
};
