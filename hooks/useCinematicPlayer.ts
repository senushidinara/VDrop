import { useState, useEffect, useRef, useCallback } from 'react';
import { Manifestation } from '../types';

export const useCinematicPlayer = (manifestation: Manifestation | null, isGenerating: boolean) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
    
    const stop = useCallback(() => {
        setIsPlaying(false);
        setActiveClipIndex(null);
        setIsFinished(false);
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
            musicAudioRef.current.currentTime = 0;
            musicAudioRef.current = null;
        }
        if (narrationAudioRef.current) {
            narrationAudioRef.current.pause();
            narrationAudioRef.current.removeAttribute('src'); // Clean up to prevent memory leaks
            narrationAudioRef.current = null;
        }
    }, []);

    // This is the primary defense against race conditions.
    // If the entire manifestation changes (e.g., a new one is generated),
    // we MUST stop and reset the player to prevent it from trying to access
    // an old index on a new (and likely different length) array of clips.
    const clipsLength = manifestation?.clips?.length ?? 0;
    useEffect(() => {
        stop();
    }, [clipsLength, stop]);

    const play = useCallback(() => {
        if (isGenerating || !manifestation || !manifestation.clips.some(c => c.status === 'completed')) return;
        
        stop(); // Reset everything before starting to be safe

        if (manifestation.musicUrl) {
            const music = new Audio(manifestation.musicUrl);
            music.loop = true;
            music.volume = 0.3;
            musicAudioRef.current = music;
            music.play().catch(e => console.error("Error playing music:", e));
        }

        setIsFinished(false);
        setIsPlaying(true);
        setActiveClipIndex(0); // Start the sequence
    }, [manifestation, isGenerating, stop]);

    const advanceToNextClip = useCallback(() => {
        if (!manifestation) {
            stop();
            return;
        }
        setActiveClipIndex(prevIndex => {
            if (prevIndex === null) {
                return null; // Already stopped
            }
            const nextIndex = prevIndex + 1;
            if (nextIndex >= manifestation.clips.length) {
                // End of sequence
                setIsPlaying(false);
                setIsFinished(true);
                if (musicAudioRef.current) {
                    musicAudioRef.current.pause();
                }
                return null;
            }
            return nextIndex;
        });
    }, [manifestation, stop]);


    // Main playback loop effect
    useEffect(() => {
        if (!isPlaying || activeClipIndex === null || !manifestation?.clips) {
            return;
        }

        // CRITICAL: Safety check to prevent IndexSizeError before any access.
        if (activeClipIndex >= manifestation.clips.length) {
            stop();
            return;
        }

        const currentClip = manifestation.clips[activeClipIndex];
        
        // If a clip failed or is otherwise incomplete, skip it.
        if (!currentClip || currentClip.status !== 'completed' || !currentClip.narrationUrl) {
            const skipTimeout = setTimeout(advanceToNextClip, 250);
            return () => clearTimeout(skipTimeout);
        }

        const narration = new Audio(currentClip.narrationUrl);
        narrationAudioRef.current = narration;

        const onEnded = () => advanceToNextClip();
        const onError = (e: ErrorEvent) => {
            console.error(`Error playing narration for clip ${activeClipIndex}:`, e);
            advanceToNextClip(); // Advance even if there's an error
        };

        narration.addEventListener('ended', onEnded);
        narration.addEventListener('error', onError);
        
        narration.play().catch(e => {
            console.error(`Error starting narration for clip ${activeClipIndex}:`, e);
            advanceToNextClip(); // Advance if playback fails to start
        });

        // Cleanup function for this specific clip
        return () => {
            narration.removeEventListener('ended', onEnded);
            narration.removeEventListener('error', onError);
            if (!narration.paused) {
                narration.pause();
            }
        };

    }, [isPlaying, activeClipIndex, manifestation, stop, advanceToNextClip]);


    return {
        isPlaying,
        activeClipIndex,
        isFinished,
        play,
        stop,
    };
};