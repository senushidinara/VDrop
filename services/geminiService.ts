
import { GoogleGenAI } from '@google/genai';
import { ImageSettings } from '../types';

const IMAGES_PER_CLIP = 4;

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
  // This service is called by our backend. It requires the Gemini API key.
  // FIX: Per coding guidelines, use process.env.API_KEY instead of process.env.GEMINI_API_KEY
  if (!process.env.API_KEY) {
    throw new Error("Gemini API Key not found. Please ensure it's configured in your backend environment.");
  }
  // FIX: Per coding guidelines, use process.env.API_KEY instead of process.env.GEMINI_API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
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