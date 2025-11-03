

import { useState, useEffect, useRef, useCallback } from 'react';
import { Manifestation } from '../types';

export const useCinematicPlayer = (manifestation: Manifestation | null) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const narrationAudioRef = useRef<HTMLAudioElement | null>(null);

    const advanceToNextClip = useCallback(() => {
        setActiveClipIndex(prevIndex => {
            if (prevIndex === null) return 0; // Should not happen if called correctly
            
            const isLastClip = !manifestation || prevIndex >= manifestation.clips.length - 1;
            if (isLastClip) {
                setIsPlaying(false);
                setIsFinished(true);
                // Fade out music
                if (musicAudioRef.current) {
                    let vol = musicAudioRef.current.volume;
                    const fadeOut = setInterval(() => {
                        if (musicAudioRef.current && vol > 0.1) {
                            vol -= 0.1;
                            musicAudioRef.current.volume = Math.max(0, vol);
                        } else {
                            clearInterval(fadeOut);
                             if (musicAudioRef.current) {
                                musicAudioRef.current.pause();
                            }
                        }
                    }, 100);
                }
                return null; // End of sequence
            }
            return prevIndex + 1;
        });
    }, [manifestation]);

    // Effect for handling playback progression
    useEffect(() => {
        if (!isPlaying || activeClipIndex === null || !manifestation?.clips) {
            return;
        }

        const currentClip = manifestation.clips[activeClipIndex];
        
        // If clip is not ready or has no audio, skip it.
        if (!currentClip || currentClip.status !== 'completed' || !currentClip.narrationUrl) {
            const skipTimeout = setTimeout(advanceToNextClip, 200);
            return () => clearTimeout(skipTimeout);
        }

        // Create and play narration for the current clip
        const narration = new Audio(currentClip.narrationUrl);
        narrationAudioRef.current = narration;

        const handleNarrationEnded = () => {
            advanceToNextClip();
        };

        narration.addEventListener('ended', handleNarrationEnded);
        
        narration.play().catch(e => {
            console.error(`Error playing narration for clip ${activeClipIndex}:`, e);
            handleNarrationEnded(); // Skip to next clip if playback fails
        });

        // Cleanup function for this specific effect run
        return () => {
            narration.removeEventListener('ended', handleNarrationEnded);
            narration.pause();
            narration.src = ''; // Release memory
            narrationAudioRef.current = null;
        };

    }, [isPlaying, activeClipIndex, manifestation, advanceToNextClip]);
    
    const cleanupAll = useCallback(() => {
        setIsPlaying(false);
        setActiveClipIndex(null);
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
            musicAudioRef.current = null;
        }
        if (narrationAudioRef.current) {
            narrationAudioRef.current.pause();
            narrationAudioRef.current = null;
        }
    }, []);

    const play = useCallback(() => {
        if (!manifestation || !manifestation.clips.some(c => c.status === 'completed')) return;
        
        cleanupAll();

        if (manifestation.musicUrl) {
            const music = new Audio(manifestation.musicUrl);
            music.loop = true;
            music.volume = 0.3;
            musicAudioRef.current = music;
            music.play().catch(e => console.error("Error playing music:", e));
        }

        setIsFinished(false);
        setIsPlaying(true);
        setActiveClipIndex(0);
    }, [manifestation, cleanupAll]);

    const stop = useCallback(() => {
        cleanupAll();
        setIsFinished(false);
    }, [cleanupAll]);

    return {
        isPlaying,
        activeClipIndex,
        isFinished,
        play,
        stop,
    };
};