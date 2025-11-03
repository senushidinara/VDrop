
import { useState, useCallback } from 'react';
import { Manifestation, Clip, ImageSettings } from '../types';
import { generateScript } from '../services/geminiService';
import { generateImageSequence } from '../services/geminiService';
import { generateNarration } from '../services/elevenLabsService';
import { generateMusic } from '../services/musicService';

const SCRIPT_LENGTH = 10; // As specified in the geminiService prompt

export const useManifestationEngine = () => {
    const [manifestation, setManifestation] = useState<Manifestation | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progressMessage, setProgressMessage] = useState('');

    const manifestVision = useCallback(async (vision: string, settings: ImageSettings) => {
        setIsGenerating(true);
        setError(null);
        setManifestation(null);
        setProgressMessage('Awakening the creative core...');

        try {
            // 1. Generate Script
            setProgressMessage('Generating narrative script...');
            const script = await generateScript(vision);
            if (script.length !== SCRIPT_LENGTH) {
                console.warn(`Expected ${SCRIPT_LENGTH} scenes, but got ${script.length}. Using what was returned.`);
            }

            // 2. Generate Music
            setProgressMessage('Composing musical score...');
            const musicUrl = generateMusic(vision);

            // 3. Initialize Clips State
            const initialClips: Clip[] = script.map((scriptText, index) => ({
                id: index,
                urls: null,
                status: 'idle',
                scriptText,
                narrationUrl: null,
            }));

            const initialManifestation: Manifestation = {
                vision,
                musicUrl,
                clips: initialClips,
            };
            setManifestation(initialManifestation);

            // 4. Generate clips (images and narration) concurrently
            setProgressMessage('Manifesting scenes...');

            const clipPromises = script.map(async (scriptText, index) => {
                // Update status to 'generating' for this clip
                setManifestation(prev => {
                    if (!prev) return prev;
                    const newClips = [...prev.clips];
                    newClips[index] = { ...newClips[index], status: 'generating' };
                    return { ...prev, clips: newClips };
                });

                try {
                    const [imageUrls, narrationUrl] = await Promise.all([
                        generateImageSequence(`${vision}, ${scriptText}`, settings),
                        generateNarration(scriptText)
                    ]);
                    
                    // Update status to 'completed'
                     setManifestation(prev => {
                        if (!prev) return prev;
                        const newClips = [...prev.clips];
                        newClips[index] = { ...newClips[index], status: 'completed', urls: imageUrls, narrationUrl };
                        return { ...prev, clips: newClips };
                    });
                } catch (clipError: any) {
                    console.error(`Error generating clip ${index}:`, clipError);
                     // Update status to 'error'
                     setManifestation(prev => {
                        if (!prev) return prev;
                        const newClips = [...prev.clips];
                        newClips[index] = { ...newClips[index], status: 'error' };
                        return { ...prev, clips: newClips };
                    });
                }
            });

            await Promise.all(clipPromises);
            
            setProgressMessage('Manifestation complete.');

        } catch (e: any) {
            console.error("Manifestation failed:", e);
            setError(e.message || "An unknown error occurred during manifestation.");
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const resetManifestation = useCallback(() => {
        setManifestation(null);
        setError(null);
        setIsGenerating(false);
        setProgressMessage('');
    }, []);


    return {
        manifestation,
        isGenerating,
        error,
        progressMessage,
        manifestVision,
        resetManifestation
    };
};
