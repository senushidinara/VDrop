import { useState, useEffect, useRef, useCallback } from 'react';
import { Manifestation } from '../types';

export const useCinematicPlayer = (manifestation: Manifestation | null, isGenerating: boolean) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
    
    // Using a ref to track the "playing" state is crucial for avoiding stale closures in event handlers.
    const isPlayingRef = useRef(isPlaying);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

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
            // By setting the src to '', we stop playback and release the audio file.
            // We also explicitly remove the event listener from the specific instance.
            narrationAudioRef.current.src = '';
            narrationAudioRef.current.load();
            narrationAudioRef.current = null;
        }
    }, []);

    // This effect is the primary defense against race conditions.
    // If the entire manifestation changes (e.g., a new one is generated),
    // we MUST stop and reset the player to prevent it from trying to access
    // an old index on a new (and likely different length) array of clips.
    useEffect(() => {
        stop();
    }, [manifestation, stop]);

    const advanceToNextClip = useCallback(() => {
        // This function now only sets state, making it safer.
        // The logic is handled inside the state updater to avoid stale state.
        setActiveClipIndex(prevIndex => {
            if (prevIndex === null || !manifestation?.clips) {
                return null;
            }
            const nextIndex = prevIndex + 1;
            if (nextIndex >= manifestation.clips.length) {
                setIsPlaying(false);
                setIsFinished(true);
                if (musicAudioRef.current) {
                    musicAudioRef.current.pause();
                }
                return null;
            }
            return nextIndex;
        });
    }, [manifestation]);


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
        
        // If a clip failed or is otherwise incomplete, skip it automatically.
        if (!currentClip || currentClip.status !== 'completed' || !currentClip.narrationUrl) {
            const skipTimeout = setTimeout(advanceToNextClip, 250); // Give a small delay for visual pacing
            return () => clearTimeout(skipTimeout);
        }

        const narration = new Audio(currentClip.narrationUrl);
        narrationAudioRef.current = narration;

        // The event handler now checks the isPlayingRef. This prevents a "ghost" onEnded event
        // from a previous, stopped audio clip from incorrectly advancing the new clip.
        const onEnded = () => {
            if (isPlayingRef.current) {
                advanceToNextClip();
            }
        };

        const onError = (e: ErrorEvent) => {
            console.error(`Error playing narration for clip ${activeClipIndex}:`, e);
            if (isPlayingRef.current) {
                advanceToNextClip(); // Advance even if there's an error
            }
        };

        narration.addEventListener('ended', onEnded);
        narration.addEventListener('error', onError);
        
        narration.play().catch(e => {
            console.error(`Error starting narration for clip ${activeClipIndex}:`, e);
            if (isPlayingRef.current) {
                advanceToNextClip(); // Advance if playback fails to start
            }
        });

        // Cleanup function for this specific clip
        return () => {
            narration.removeEventListener('ended', onEnded);
            narration.removeEventListener('error', onError);
        };

    }, [isPlaying, activeClipIndex, manifestation, stop, advanceToNextClip]);

    const play = useCallback(() => {
        if (isGenerating || !manifestation || !manifestation.clips.some(c => c.status === 'completed')) return;
        
        // Ensure everything is stopped and reset before starting a new playback session.
        stop(); 

        if (manifestation.musicUrl) {
            const music = new Audio(manifestation.musicUrl);
            music.loop = true;
            music.volume = 0.3;
            musicAudioRef.current = music;
            music.play().catch(e => console.error("Error playing music:", e));
        }

        setIsFinished(false);
        setIsPlaying(true);
        setActiveClipIndex(0); // Start the sequence from the beginning
    }, [manifestation, isGenerating, stop]);


    return {
        isPlaying,
        activeClipIndex,
        isFinished,
        play,
        stop,
    };
};