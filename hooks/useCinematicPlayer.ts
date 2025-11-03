
import { useState, useEffect, useRef, useCallback } from 'react';
import { Manifestation } from '../types';

export const useCinematicPlayer = (manifestation: Manifestation | null) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
    const timeoutRef = useRef<number | null>(null);

    // Cleanup function
    const cleanup = useCallback(() => {
        if (musicAudioRef.current) {
            musicAudioRef.current.pause();
            musicAudioRef.current = null;
        }
        if (narrationAudioRef.current) {
            narrationAudioRef.current.pause();
            narrationAudioRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    // Effect for handling playback progression
    useEffect(() => {
        if (!isPlaying || activeClipIndex === null || !manifestation?.clips) {
            return;
        }

        const clips = manifestation.clips;
        if (activeClipIndex >= clips.length) {
            // End of playback
            setIsPlaying(false);
            setIsFinished(true);
            setActiveClipIndex(null);
            if (musicAudioRef.current) {
                // Fade out music
                let vol = musicAudioRef.current.volume;
                const fadeOut = setInterval(() => {
                    if (vol > 0.1) {
                        vol -= 0.1;
                        if (musicAudioRef.current) musicAudioRef.current.volume = vol;
                    } else {
                        clearInterval(fadeOut);
                        cleanup();
                    }
                }, 200);
            }
            return;
        }

        const currentClip = clips[activeClipIndex];

        if (currentClip.status === 'completed' && currentClip.narrationUrl) {
            // Cleanup previous narration
            if (narrationAudioRef.current) {
                narrationAudioRef.current.pause();
            }
            
            const narration = new Audio(currentClip.narrationUrl);
            narrationAudioRef.current = narration;

            const playNext = () => {
                setActiveClipIndex(prev => (prev === null ? 0 : prev + 1));
            };

            narration.addEventListener('ended', playNext);
            narration.play().catch(e => {
                console.error("Error playing narration:", e);
                // If playback fails, move to the next clip after a short delay
                timeoutRef.current = window.setTimeout(playNext, 1000);
            });

            // Fallback timeout in case 'ended' event doesn't fire
            timeoutRef.current = window.setTimeout(playNext, 8000);

        } else {
            // Skip broken or non-completed clips after a short delay
             timeoutRef.current = window.setTimeout(() => {
                setActiveClipIndex(prev => (prev === null ? 0 : prev + 1));
            }, 500);
        }

        return () => {
            if (narrationAudioRef.current) {
                narrationAudioRef.current.pause();
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

    }, [isPlaying, activeClipIndex, manifestation, cleanup]);

    const play = useCallback(() => {
        if (!manifestation || !manifestation.clips.length) return;
        cleanup(); // Cleanup any previous state

        if (manifestation.musicUrl) {
            const music = new Audio(manifestation.musicUrl);
            music.loop = true;
            music.volume = 0.3;
            musicAudioRef.current = music;
            music.play().catch(e => console.error("Error playing music:", e));
        }

        setIsFinished(false);
        setActiveClipIndex(0);
        setIsPlaying(true);
    }, [manifestation, cleanup]);

    const stop = useCallback(() => {
        cleanup();
        setIsPlaying(false);
        setActiveClipIndex(null);
        setIsFinished(false);
    }, [cleanup]);

    return {
        isPlaying,
        activeClipIndex,
        isFinished,
        play,
        stop,
    };
};
