import { GoogleGenAI, Type } from '@google/genai';
import { ImageSettings } from '../types';

const IMAGES_PER_CLIP = 4;

// Get API key from environment
const getApiKey = (): string => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error("Gemini API Key not configured. Please add your API key to the .env file.");
    }
    return apiKey;
};

/**
 * Generates a short, multi-scene narrative script based on a user's creative vision.
 */
export const generateScript = async (vision: string): Promise<string[]> => {
    try {
        const apiKey = getApiKey();
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a cinematic creative director. A user has a vision: "${vision}".
Your task is to break this vision down into a short, compelling narrative script consisting of exactly 10 distinct scenes or shots.
Each scene should be a single, concise sentence that can be used for both narration and as a prompt for image generation.
Return the result as a JSON object with a single key "script" which is an array of these 10 scene strings.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        script: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    },
                    required: ['script']
                }
            }
        });

        const responseText = response.text.trim();
        let jsonText = responseText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();

        if (!jsonText.startsWith('{')) {
            if (jsonText.startsWith('[')) {
                jsonText = `{ "script": ${jsonText} }`;
            } else {
                throw new Error(`API returned a non-JSON response: ${responseText}`);
            }
        }

        const responseObject = JSON.parse(jsonText);

        if (!responseObject.script || !Array.isArray(responseObject.script) || responseObject.script.length === 0) {
            throw new Error("Malformed script data received from API.");
        }

        return responseObject.script;

    } catch (e: any) {
        console.error("Error generating script:", e);
        if (e.message.includes('API Key not configured')) {
            throw e;
        }
        throw new Error(`Failed to generate script: ${e.message}`);
    }
};

/**
 * Generates a sequence of images using the Google Gemini API (Imagen model).
 */
export const generateImageSequence = async (
    prompt: string,
    settings: ImageSettings,
): Promise<string[]> => {
    try {
        const apiKey = getApiKey();
        const ai = new GoogleGenAI({ apiKey });

        const enhancedPrompt = `${prompt}, cinematic, high detail, epic composition, digital painting`;

        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-001',
            prompt: enhancedPrompt,
            config: {
                numberOfImages: IMAGES_PER_CLIP,
                aspectRatio: settings.aspectRatio,
                outputMimeType: 'image/png',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("Image generation failed: The API returned no images.");
        }

        return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);

    } catch (e: any) {
        console.error("Error generating images:", e);

        let userFriendlyMessage = "Image generation failed.";
        if (e.message) {
            if (e.message.includes('quota') || e.message.includes('RESOURCE_EXHAUSTED')) {
                userFriendlyMessage = "API quota exceeded. Please check your plan or wait and try again.";
            } else if (e.message.includes('API key') || e.message.includes('API Key')) {
                userFriendlyMessage = e.message;
            } else if (e.message.includes('not valid')) {
                userFriendlyMessage = "Your Gemini API key is not valid. Please check your .env file.";
            } else {
                userFriendlyMessage = `Image generation failed: ${e.message}`;
            }
        }
        throw new Error(userFriendlyMessage);
    }
};
