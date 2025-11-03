import { GoogleGenAI, Type } from '@google/genai';
import { ImageSettings } from '../types';

const IMAGES_PER_CLIP = 4;

/**
 * Generates a short, multi-scene narrative script based on a user's creative vision.
 * This function prompts the Gemini model to act as a creative director and return a structured
 * JSON object containing a script broken down into distinct scenes.
 * @param vision The high-level creative concept from the user.
 * @returns A promise that resolves to an array of strings, where each string is a scene's script line.
 * @throws An error if the script generation fails or the response is malformed.
 */
export const generateScript = async (vision: string): Promise<string[]> => {
    if (!process.env.API_KEY) {
        throw new Error("Gemini API Key not found. Please ensure it's configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `You are a cinematic creative director. A user has a vision: "${vision}".
    Your task is to break this vision down into a short, compelling narrative script consisting of exactly 10 distinct scenes or shots.
    Each scene should be a single, concise sentence that can be used for both narration and as a prompt for image generation.
    Return the result as a JSON object with a single key "script" which is an array of these 10 scene strings.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
                    }
                }
            }
        });
        
        const responseText = response.text.trim();
        const responseObject = JSON.parse(responseText);

        if (!responseObject.script || !Array.isArray(responseObject.script) || responseObject.script.length === 0) {
            throw new Error("Malformed script data received from API.");
        }

        return responseObject.script;

    } catch (e: any) {
        console.error("Error generating script:", e);
        throw new Error("Failed to generate the narrative script. The creative core may be offline.");
    }
};


/**
 * Generates a sequence of images using the Google Gemini API (Imagen 4.0 model).
 * This function constructs a prompt, communicates with the API, and returns an array of
 * Base64-encoded image strings upon success. It includes robust error handling
 * to provide user-friendly feedback for common issues like invalid API keys or quota limits.
 * @param prompt The base creative prompt for the image generation.
 * @param settings An object containing image settings, specifically the aspectRatio.
 * @returns A promise that resolves to an array of data URLs (Base64 encoded PNGs).
 * @throws An error with a user-friendly message if the image generation fails.
 */
export const generateImageSequence = async (
  prompt: string,
  settings: ImageSettings,
): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("Gemini API Key not found. Please ensure it's configured in your backend environment.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Enhance prompt for more cinematic results
  const enhancedPrompt = `${prompt}, cinematic, high detail, epic composition, digital painting`;

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
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
    // Attempt to parse the error message for more specific feedback
    let userFriendlyMessage = "An unexpected error occurred during image generation.";
    if (e.message) {
        if (e.message.includes('quota') || e.message.includes('RESOURCE_EXHAUSTED')) {
            userFriendlyMessage = "API quota exceeded. Please check your plan and billing details, or wait and try again.";
        } else if (e.message.includes('API key not valid')) {
            userFriendlyMessage = "Your Gemini API key is not valid. Please check your configuration.";
        } else {
            userFriendlyMessage = "Image generation failed. Please try a different prompt."
        }
    }
    throw new Error(userFriendlyMessage);
  }
};
