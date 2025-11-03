import { useState, useEffect, useRef, useCallback } from 'react';
import { Manifestation } from '../types';

export const useCinematicPlayer = (manifestation: Manifestation | null) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
    
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
    
    const stop = useCallback(() => {
        setIsPlaying(false);
        setActiveClipIndex(null);
        setIsFinished(false);
        cleanupAllAudio();
    }, [cleanupAllAudio]);

    // This is the critical fix for the IndexSizeError.
    // If the entire manifestation changes (e.g., a new one is generated),
    // we MUST stop and reset the player to prevent it from trying to access
    // an old index on a new (and likely different length) array of clips.
    useEffect(() => {
        stop();
    }, [manifestation, stop]);


    // Effect for handling playback progression
    useEffect(() => {
        if (!isPlaying || activeClipIndex === null || !manifestation?.clips) {
            return;
        }

        const currentClip = manifestation.clips[activeClipIndex];
        
        const handlePlaybackEnd = () => {
             setActiveClipIndex(prevIndex => {
                if (prevIndex === null) return null;
                
                const isLastClip = !manifestation || prevIndex >= manifestation.clips.length - 1;

                if (isLastClip) {
                    setIsPlaying(false);
                    setIsFinished(true);
                    if (musicAudioRef.current) {
                        musicAudioRef.current.pause();
                    }
                    return null;
                }
                return prevIndex + 1;
            });
        };

        if (!currentClip || currentClip.status !== 'completed' || !currentClip.narrationUrl) {
            const skipTimeout = setTimeout(handlePlaybackEnd, 250);
            return () => clearTimeout(skipTimeout);
        }

        const narration = new Audio(currentClip.narrationUrl);
        narrationAudioRef.current = narration;

        narration.addEventListener('ended', handlePlaybackEnd);
        narration.addEventListener('error', (e) => {
            console.error(`Error playing narration for clip ${activeClipIndex}:`, e);
            handlePlaybackEnd();
        });
        
        narration.play().catch(e => {
            console.error(`Error starting narration for clip ${activeClipIndex}:`, e);
            handlePlaybackEnd();
        });

        return () => {
            narration.removeEventListener('ended', handlePlaybackEnd);
            narration.removeEventListener('error', handlePlaybackEnd);
            if (!narration.paused) {
                narration.pause();
            }
            narration.src = '';
            narrationAudioRef.current = null;
        };

    }, [isPlaying, activeClipIndex, manifestation]);
    
    const play = useCallback(() => {
        if (!manifestation || !manifestation.clips.some(c => c.status === 'completed')) return;
        
        stop(); // Reset everything before starting

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
    }, [manifestation, stop]);


    return {
        isPlaying,
        activeClipIndex,
        isFinished,
        play,
        stop,
    };
};