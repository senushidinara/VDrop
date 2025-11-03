import { ELEVENLABS_API_URL, VOICE_ID } from "../config";

/**
 * Generates narration audio from a given text string using the ElevenLabs Text-to-Speech API.
 * It sends the text to the API with specified voice settings and returns a playable
 * object URL for the generated audio blob. This function requires the ELEVENLABS_API_KEY
 * to be set in the environment secrets.
 * @param text The text content to be converted into speech.
 * @returns A promise that resolves to a local blob object URL for the generated MP3 audio.
 * @throws An error with a detailed message if the API request fails or the key is missing.
 */
export const generateNarration = async (
  text: string
): Promise<string> => {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ElevenLabs API Key not found. Please configure your environment secrets.");
  }

  const apiEndpoint = `${ELEVENLABS_API_URL}/v1/text-to-speech/${VOICE_ID}`;

  try {
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
        const errorBody = await response.json().catch(() => ({ detail: { message: "Unknown API error." }}));
        const errorMessage = errorBody.detail?.message || `API request failed with status ${response.status}`;
        throw new Error(`ElevenLabs API Error: ${errorMessage}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);

  } catch (error: any) {
    console.error("Error generating narration:", error);
    throw new Error(error.message || "An unexpected error occurred while generating narration.");
  }
};
