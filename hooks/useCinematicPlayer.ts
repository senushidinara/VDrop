import { useState, useEffect, useRef, useCallback } from 'react';
import { Manifestation } from '../types';

export const useCinematicPlayer = (manifestation: Manifestation | null, isGenerating: boolean) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeClipIndex, setActiveClipIndex] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const musicAudioRef = useRef<HTMLAudioElement | null>(null);
    const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
    const isPlayingRef = useRef(isPlaying);

    // Keep ref in sync with state
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Stop and reset when manifestation changes
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
            narrationAudioRef.current.src = '';
            narrationAudioRef.current.load();
            narrationAudioRef.current = null;
        }
    }, []);

    // Reset when manifestation changes
    useEffect(() => {
        stop();
    }, [manifestation, stop]);

    const advanceToNextClip = useCallback(() => {
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

    // Handle clip narration playback
    useEffect(() => {
        if (!isPlaying || activeClipIndex === null || !manifestation) return;

        const currentClip = manifestation.clips[activeClipIndex];
        if (!currentClip || currentClip.status !== 'completed' || !currentClip.narrationUrl) {
            advanceToNextClip();
            return;
        }

        // Clean up previous narration
        if (narrationAudioRef.current) {
            narrationAudioRef.current.pause();
            narrationAudioRef.current.src = '';
            narrationAudioRef.current.load();
        }

        // Create new audio element for narration
        const narrationAudio = new Audio(currentClip.narrationUrl);
        narrationAudioRef.current = narrationAudio;

        const handleNarrationEnd = () => {
            if (isPlayingRef.current) {
                advanceToNextClip();
            }
        };

        const handleNarrationError = (e: ErrorEvent) => {
            console.error('Narration playback error:', e);
            if (isPlayingRef.current) {
                advanceToNextClip();
            }
        };

        narrationAudio.addEventListener('ended', handleNarrationEnd);
        narrationAudio.addEventListener('error', handleNarrationError as any);

        narrationAudio.play().catch(err => {
            console.error('Failed to play narration:', err);
            if (isPlayingRef.current) {
                advanceToNextClip();
            }
        });

        return () => {
            narrationAudio.removeEventListener('ended', handleNarrationEnd);
            narrationAudio.removeEventListener('error', handleNarrationError as any);
            narrationAudio.pause();
        };
    }, [isPlaying, activeClipIndex, manifestation, advanceToNextClip]);

    const play = useCallback(() => {
        if (!manifestation || isGenerating) return;

        const completedClips = manifestation.clips.filter(c => c.status === 'completed');
        if (completedClips.length === 0) {
            console.warn('No completed clips to play');
            return;
        }

        setIsPlaying(true);
        setIsFinished(false);
        setActiveClipIndex(0);

        // Start background music
        if (manifestation.musicUrl && !musicAudioRef.current) {
            const musicAudio = new Audio(manifestation.musicUrl);
            musicAudio.loop = true;
            musicAudio.volume = 0.3;
            musicAudioRef.current = musicAudio;
            
            musicAudio.play().catch(err => {
                console.error('Failed to play music:', err);
            });
        }
    }, [manifestation, isGenerating]);

    return {
        isPlaying,
        activeClipIndex,
        isFinished,
        play,
        stop,
    };
};
