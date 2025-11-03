import { useState, useEffect, useRef, useCallback } from 'react';
import { Manifestation } from '../types';

export const useCinematicPlayer = (manifestation: Manifestation | null) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const narrationAudioRef = useRef<HTMLAudioElement | null>(null);

    // Effect for handling playback progression
    useEffect(() => {
        // This effect is the single source of truth for playing a clip's narration.
        // It should only run when the active clip changes while in a playing state.
        
        if (!isPlaying || activeClipIndex === null || !manifestation?.clips) {
            return;
        }

        const currentClip = manifestation.clips[activeClipIndex];
        
        const handlePlaybackEnd = () => {
             setActiveClipIndex(prevIndex => {
                if (prevIndex === null) return null; // Should not happen
                
                const isLastClip = !manifestation || prevIndex >= manifestation.clips.length - 1;

                if (isLastClip) {
                    setIsPlaying(false);
                    setIsFinished(true);
                    if (musicAudioRef.current) {
                        musicAudioRef.current.pause();
                    }
                    return null; // End of sequence
                }
                return prevIndex + 1; // Advance to next clip
            });
        };

        // If the current clip is not ready or has no audio, skip it after a short delay.
        if (!currentClip || currentClip.status !== 'completed' || !currentClip.narrationUrl) {
            const skipTimeout = setTimeout(handlePlaybackEnd, 250); // Use a small delay for skipping
            return () => clearTimeout(skipTimeout);
        }

        // Create, play, and set up listeners for the narration audio.
        const narration = new Audio(currentClip.narrationUrl);
        narrationAudioRef.current = narration;

        narration.addEventListener('ended', handlePlaybackEnd);
        narration.addEventListener('error', (e) => {
            console.error(`Error playing narration for clip ${activeClipIndex}:`, e);
            handlePlaybackEnd(); // Also advance on error
        });
        
        narration.play().catch(e => {
            console.error(`Error starting narration for clip ${activeClipIndex}:`, e);
            handlePlaybackEnd(); // Skip to next clip if playback fails to start
        });

        // The single, most important cleanup function for this effect run.
        return () => {
            narration.removeEventListener('ended', handlePlaybackEnd);
            narration.removeEventListener('error', handlePlaybackEnd);
            if (!narration.paused) {
                narration.pause();
            }
            narration.src = ''; // Release memory
            narrationAudioRef.current = null;
        };

    }, [isPlaying, activeClipIndex, manifestation]);
    
    const cleanupAllAudio = useCallback(() => {
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
            musicAudioRef.current.src = '';
            musicAudioRef.current = null;
        }
        if (narrationAudioRef.current) {
            narrationAudioRef.current.pause();
            narrationAudioRef.current.src = '';
            narrationAudioRef.current = null;
        }
    }, []);

    const play = useCallback(() => {
        if (!manifestation || !manifestation.clips.some(c => c.status === 'completed')) return;
        
        // Stop any existing playback and clean up
        setIsPlaying(false);
        setActiveClipIndex(null);
        cleanupAllAudio();

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
    }, [manifestation, cleanupAllAudio]);

    const stop = useCallback(() => {
        setIsPlaying(false);
        setActiveClipIndex(null);
        setIsFinished(false);
        cleanupAllAudio();
    }, [cleanupAllAudio]);

    return {
        isPlaying,
        activeClipIndex,
        isFinished,
        play,
        stop,
    };
};