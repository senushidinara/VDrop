import React, { useState, useEffect, useRef } from 'react';
import { generateImageSequence, generateScript } from '../services/geminiService';
import { generateNarration } from '../services/elevenLabsService';
import { generateMusic } from '../services/musicService';
import ClipDisplay from './VideoPlayer';
import { AspectRatio, ImageSettings, Clip, Manifestation } from '../types';
import { FilmIcon, RefreshIcon } from './IconComponents';

interface ManifestationPlayerProps {
    manifestation: Manifestation | null;
    onPlaybackChange: (isPlaying: boolean, activeIndex: number) => void;
    currentlyPlayingIndex: number;
    setCurrentlyPlayingIndex: React.Dispatch<React.SetStateAction<number>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManifestationPlayer: React.FC<ManifestationPlayerProps> = ({ 
    manifestation, 
    onPlaybackChange,
    currentlyPlayingIndex,
    setCurrentlyPlayingIndex,
    isPlaying,
    setIsPlaying
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const musicRef = useRef<HTMLAudioElement>(null);

    // Effect to control master play/pause and sync sources
    useEffect(() => {
        const audioEl = audioRef.current;
        const musicEl = musicRef.current;
        if (!audioEl || !musicEl || !manifestation) return;

        if (isPlaying) {
            const currentClip = manifestation.clips[currentlyPlayingIndex];
            if (currentClip?.narrationUrl && audioEl.src !== currentClip.narrationUrl) {
                audioEl.src = currentClip.narrationUrl;
            }
            audioEl.play().catch(e => console.error("Audio play failed:", e));
            musicEl.play().catch(e => console.error("Music play failed:", e));
        } else {
            audioEl.pause();
            musicEl.pause();
        }
        onPlaybackChange(isPlaying, currentlyPlayingIndex);
    }, [isPlaying, currentlyPlayingIndex, manifestation, onPlaybackChange]);
    
    // Effect to handle the sequence of narration
    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl || !manifestation) return;

        const handleTrackEnd = () => {
            if (currentlyPlayingIndex < manifestation.clips.length - 1) {
                setCurrentlyPlayingIndex(prevIndex => prevIndex + 1);
            } else {
                // End of sequence
                setIsPlaying(false);
                setCurrentlyPlayingIndex(0); 
            }
        };

        audioEl.addEventListener('ended', handleTrackEnd);
        return () => audioEl.removeEventListener('ended', handleTrackEnd);
    }, [manifestation, currentlyPlayingIndex, setIsPlaying, setCurrentlyPlayingIndex]);


    const handlePlayPause = () => {
        if (!manifestation || manifestation.clips.some(c => !c.narrationUrl)) return;
        
        // If at the end, reset to the beginning before playing
        if (currentlyPlayingIndex >= (manifestation?.clips.length - 1) && audioRef.current?.ended) {
            setCurrentlyPlayingIndex(0);
        }
        setIsPlaying(prev => !prev);
    }

    if (!manifestation) return null;

    return (
        <div className="mt-4 p-4 bg-black/50 rounded-lg border border-[var(--theme-border-color)]">
            <div className="flex items-center gap-4">
                <button 
                    onClick={handlePlayPause}
                    className="w-12 h-12 bg-gradient-to-br from-[var(--theme-accent1)] to-[var(--theme-accent2)] rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                    disabled={manifestation.clips.some(c => c.status !== 'completed')}
                >
                    {isPlaying ? 
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg> :
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.018 14.382A1 1 0 013 13.518V6.482a1 1 0 011.504-.864l7.018 3.51a1 1 0 010 1.728l-7.018 3.51a1 1 0 01-.486.13z"/></svg>
                    }
                </button>
                <div className="flex-grow min-w-0">
                    <p className="font-orbitron text-lg text-white truncate">Concept Trailer</p>
                    <p className="text-sm text-[var(--theme-text-subtitle)] truncate">{manifestation.vision}</p>
                </div>
            </div>
            {/* Hidden audio players */}
            <audio ref={audioRef} preload="auto" />
            {manifestation.musicUrl && <audio ref={musicRef} src={manifestation.musicUrl} preload="auto" loop />}
        </div>
    );
};


const CreativeHyperverse: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const [vision, setVision] = useState<string>('');
    const [settings, setSettings] = useState<ImageSettings>({ aspectRatio: '16:9' });
    const [manifestation, setManifestation] = useState<Manifestation | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generationStep, setGenerationStep] = useState('');
    const [error, setError] = useState<string | null>(null);
    
    // State for the player is now managed here
    const [activeClipIndex, setActiveClipIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);


    const handleGenerateClick = async () => {
        if (!process.env.API_KEY || !process.env.ELEVENLABS_API_KEY) {
            setError('API keys for Gemini and ElevenLabs must be configured to awaken the live system.');
            return;
        }
        if (!vision.trim()) {
            setError('Please enter a core vision to manifest.');
            return;
        }
        
        handleReset(); // Reset state before new generation

        try {
            setIsGenerating(true);
            // Step 1: Generate Script
            setGenerationStep('Writing the narrative script...');
            const scriptLines = await generateScript(vision);
            
            const initialClips = scriptLines.map((line, i) => ({ id: i, urls: null, status: 'idle' as const, scriptText: line, narrationUrl: null }));
            const musicUrl = generateMusic(vision); // This is a simulated service
            setManifestation({ vision, musicUrl, clips: initialClips });

            // Step 2 & 3: Generate Image Sequences & Narration for each clip in parallel
            for (let i = 0; i < initialClips.length; i++) {
                setGenerationStep(`Manifesting scene ${i + 1} of ${initialClips.length}...`);
                setManifestation(prev => prev ? ({...prev, clips: prev.clips.map(c => c.id === i ? { ...c, status: 'generating' } : c)}) : null);
                
                try {
                    // Fire off image and audio generation at the same time
                    const [urls, narrationUrl] = await Promise.all([
                        generateImageSequence(initialClips[i].scriptText, settings),
                        generateNarration(initialClips[i].scriptText)
                    ]);
                    
                    setManifestation(prev => prev ? ({...prev, clips: prev.clips.map(c => c.id === i ? { ...c, urls, narrationUrl, status: 'completed' } : c)}) : null);

                } catch (clipError: any) {
                    console.error(`Error generating clip ${i}:`, clipError.message);
                    setManifestation(prev => prev ? ({...prev, clips: prev.clips.map(c => c.id === i ? { ...c, status: 'error' } : c)}) : null);
                }
            }

        } catch (err: any) {
            console.error("Manifestation failed:", err.message);
            setError(err.message);
        }
        
        setGenerationStep('');
        setIsGenerating(false);
    };

    const handleReset = () => {
        setVision('');
        setManifestation(null);
        setError(null);
        setIsGenerating(false);
        setGenerationStep('');
        setIsPlaying(false);
        setActiveClipIndex(0);
    };
    
    const handlePlaybackChange = (playing: boolean, activeIndex: number) => {
        // This callback could be used for other effects if needed
        setActiveClipIndex(activeIndex);
    };

    const handleDownload = async (urls: string[], id: number) => {
        // ... (download logic remains the same)
    };

    return (
        <div className="fixed inset-0 bg-[var(--theme-bg-primary)] z-20 animate-fade-in hyperverse-layout">
             <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'left' }}>
                    <h2 className="font-orbitron text-3xl font-bold text-[var(--theme-text-title)]">The Manifestation Sanctum</h2>
                    <p className="text-lg text-[var(--theme-text-subtitle)]" style={{marginTop: '0.25rem'}}>Where your vision transcends imagination and becomes a multi-sensory reality.</p>
                </div>
                 <button onClick={onClose} className="px-5 py-3 text-lg bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-bg-hover)] rounded-lg font-semibold">&larr; Back to Anatomy</button>
            </div>
            
            <div className="hyperverse-grid">
                {/* Control Panel */}
                <div className="hyperverse-controls bg-[var(--theme-bg-secondary)] backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-[var(--theme-border-color)] shadow-2xl shadow-black/50 panel-corners">
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <textarea
                            id="vision"
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            placeholder="Describe your core vision... (e.g., 'A lone astronaut discovers a glowing alien forest on a distant moon')"
                            className="w-full p-3 bg-black/30 border-2 border-[var(--theme-border-color)] rounded-lg focus:ring-2 focus:ring-[var(--theme-accent1)] focus:border-[var(--theme-accent1)] transition-all duration-300 disabled:opacity-50 text-white placeholder-gray-500 text-lg flex-grow"
                            style={{ minHeight: '150px' }}
                            disabled={isGenerating}
                        />
                        <div>
                            <label className="text-sm font-semibold mb-2 block text-[var(--theme-text-light)] font-orbitron">Aspect Ratio</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                                {(['16:9', '9:16', '1:1', '4:3', '3:4'] as AspectRatio[]).map(ratio => (
                                    <button key={ratio} onClick={() => setSettings(s => ({...s, aspectRatio: ratio}))} disabled={isGenerating} className={`py-2 px-1 text-xs sm:text-sm rounded-md transition-colors border-2 ${settings.aspectRatio === ratio ? 'bg-[var(--theme-accent1)] text-white font-bold border-white/50' : 'bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-bg-hover)] border-transparent'}`}>
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {isGenerating && (
                             <div className="text-center p-3 bg-black/30 rounded-lg">
                                 <p className="font-orbitron text-[var(--theme-accent2)]">{generationStep}</p>
                             </div>
                        )}
                        {manifestation && !isGenerating && (
                            <div className="p-4 bg-black/30 rounded-lg flex-grow overflow-y-auto">
                                <h3 className="font-orbitron text-lg text-[var(--theme-text-title)] mb-2">Generated Narrative</h3>
                                <div className="text-sm text-gray-300 italic space-y-1">
                                    {manifestation.clips.map((clip, index) => (
                                        <p key={clip.id} className={`transition-colors duration-300 p-1 rounded ${index === activeClipIndex ? 'bg-cyan-500/20 text-cyan-300' : ''}`}>
                                            {clip.scriptText}
                                        </p>
                                    ))}
                                </div>
                                <ManifestationPlayer 
                                    manifestation={manifestation} 
                                    onPlaybackChange={handlePlaybackChange} 
                                    currentlyPlayingIndex={activeClipIndex}
                                    setCurrentlyPlayingIndex={setActiveClipIndex}
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                />
                            </div>
                        )}
                    </div>
                     <div style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-end', gap: '0.5rem', paddingTop: '1rem' }}>
                        <button
                            onClick={handleGenerateClick}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 text-xl font-bold text-white bg-gradient-to-r from-[var(--theme-accent1)] to-[var(--theme-accent2)] rounded-lg shadow-lg hover:from-[var(--theme-accent1)]/80 hover:to-[var(--theme-accent2)]/80 transition-all duration-300 transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:scale-100 font-orbitron pulse-glow"
                            >
                            <FilmIcon />
                            MANIFEST
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 p-3 font-semibold text-white bg-[var(--theme-bg-tertiary)] rounded-lg shadow-md hover:bg-[var(--theme-bg-hover)] transition-all duration-300 disabled:opacity-50"
                            disabled={isGenerating}
                            >
                            <RefreshIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>

                {/* Viewscreen */}
                 <div className="bg-[var(--theme-bg-secondary)] backdrop-blur-sm p-4 rounded-2xl border border-[var(--theme-border-color)] shadow-2xl shadow-black/50 overflow-y-auto panel-corners">
                    <div className="hyperverse-viewscreen-grid">
                        {manifestation?.clips.map((clip, index) => (
                            <ClipDisplay key={clip.id} clip={clip} onDownload={handleDownload} isActive={index === activeClipIndex} />
                        ))}
                        {/* Fill empty slots if no manifestation */}
                        {!manifestation && Array.from({ length: 10 }).map((_, i) => (
                             <div key={i} className="panel-corners aspect-video bg-black/50 rounded-lg shadow-lg border border-[var(--theme-border-color)] flex items-center justify-center">
                                 <p className="text-gray-600 text-sm font-orbitron">Slot {i+1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {error && (
              <div 
                 onClick={() => setError(null)}
                 className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-800/90 backdrop-blur-sm text-white py-3 px-6 rounded-lg shadow-2xl border border-red-600 cursor-pointer hover:bg-red-700 transition-colors z-50 animate-fade-in"
                 title="Click to dismiss"
                 style={{ transform: 'translateX(-50%)' }}
              >
                <p><span className="font-bold">SYSTEM ALERT:</span> {error}</p>
              </div>
            )}
        </div>
    );
};

export default CreativeHyperverse;