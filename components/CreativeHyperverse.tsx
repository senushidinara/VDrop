import React, { useState, useEffect, useRef } from 'react';
import { generateImageSequence, generateScript } from '../services/geminiService';
import { generateNarration } from '../services/elevenLabsService';
import { generateMusic } from '../services/musicService';
import ClipDisplay from './VideoPlayer';
import { AspectRatio, ImageSettings, Clip, Manifestation } from '../types';
import { FilmIcon, RefreshIcon, SpeakerWaveIcon } from './IconComponents';

interface ManifestationPlayerProps {
    manifestation: Manifestation | null;
    setActiveClipIndex: (index: number) => void;
}

const ManifestationPlayer: React.FC<ManifestationPlayerProps> = ({ manifestation, setActiveClipIndex }) => {
    const narrationRef = useRef<HTMLAudioElement>(null);
    const musicRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (manifestation && isPlaying) {
            narrationRef.current?.play();
            musicRef.current?.play();
        } else {
            narrationRef.current?.pause();
            musicRef.current?.pause();
        }
    }, [isPlaying, manifestation]);

    useEffect(() => {
        const narrationEl = narrationRef.current;
        if (!narrationEl) return;

        const handleTimeUpdate = () => {
            if (!manifestation) return;
            const { duration } = narrationEl;
            if (isNaN(duration) || duration === 0) return;
            
            const segmentDuration = duration / manifestation.clips.length;
            const newIndex = Math.floor(narrationEl.currentTime / segmentDuration);
            setActiveClipIndex(Math.min(newIndex, manifestation.clips.length - 1));
        };
        
        const handleEnded = () => {
            setIsPlaying(false);
            setActiveClipIndex(0); // Reset to first clip on end
        }

        narrationEl.addEventListener('timeupdate', handleTimeUpdate);
        narrationEl.addEventListener('ended', handleEnded);

        return () => {
            narrationEl.removeEventListener('timeupdate', handleTimeUpdate);
            narrationEl.removeEventListener('ended', handleEnded);
        };
    }, [manifestation, setActiveClipIndex]);

    if (!manifestation) return null;

    return (
        <div className="mt-4 p-4 bg-black/50 rounded-lg border border-[var(--theme-border-color)]">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-gradient-to-br from-[var(--theme-accent1)] to-[var(--theme-accent2)] rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
                >
                    {isPlaying ? 
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg> :
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.018 14.382A1 1 0 013 13.518V6.482a1 1 0 011.504-.864l7.018 3.51a1 1 0 010 1.728l-7.018 3.51a1 1 0 01-.486.13z"/></svg>
                    }
                </button>
                <div className="flex-grow">
                    <p className="font-orbitron text-lg text-white">Concept Trailer</p>
                    <p className="text-sm text-[var(--theme-text-subtitle)] truncate">{manifestation.vision}</p>
                </div>
            </div>
            {manifestation.narrationUrl && <audio ref={narrationRef} src={manifestation.narrationUrl} preload="auto" />}
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
    const [activeClipIndex, setActiveClipIndex] = useState(0);

    const handleGenerateClick = async () => {
        if (!process.env.API_KEY || !process.env.ELEVENLABS_API_KEY) {
            setError('API keys for Gemini and ElevenLabs must be configured to awaken the live system.');
            return;
        }
        if (!vision.trim()) {
            setError('Please enter a core vision to manifest.');
            return;
        }
        
        setError(null);
        setIsGenerating(true);
        setManifestation(null);
        setActiveClipIndex(0);

        try {
            // Step 1: Generate Script
            setGenerationStep('Writing the narrative script...');
            const scriptLines = await generateScript(vision);
            const fullScript = scriptLines.join(' ');
            
            const initialClips = scriptLines.map((line, i) => ({ id: i, urls: null, status: 'idle' as const, scriptText: line }));
            let tempManifestation: Manifestation = { vision, fullScript, narrationUrl: null, musicUrl: null, clips: initialClips };
            setManifestation(tempManifestation);

            // Step 2: Generate Audio (Narration & Music)
            setGenerationStep('Giving the vision a voice and soul...');
            const narrationUrl = await generateNarration(fullScript);
            const musicUrl = generateMusic(vision); // This is a simulated service
            tempManifestation = { ...tempManifestation, narrationUrl, musicUrl };
            setManifestation(tempManifestation);

            // Step 3: Generate Image Sequences for each clip
            for (const clip of initialClips) {
                setGenerationStep(`Manifesting scene ${clip.id + 1} of ${initialClips.length}...`);
                setManifestation(prev => prev ? ({...prev, clips: prev.clips.map(c => c.id === clip.id ? { ...c, status: 'generating' } : c)}) : null);
                
                try {
                    const urls = await generateImageSequence(clip.scriptText, settings);
                    setManifestation(prev => prev ? ({...prev, clips: prev.clips.map(c => c.id === clip.id ? { ...c, urls, status: 'completed' } : c)}) : null);
                } catch (clipError: any) {
                    console.error(`Error generating clip ${clip.id}:`, clipError.message);
                    setManifestation(prev => prev ? ({...prev, clips: prev.clips.map(c => c.id === clip.id ? { ...c, status: 'error' } : c)}) : null);
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
        setActiveClipIndex(0);
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
                        {manifestation?.fullScript && !isGenerating && (
                            <div className="p-4 bg-black/30 rounded-lg flex-grow overflow-y-auto">
                                <h3 className="font-orbitron text-lg text-[var(--theme-text-title)] mb-2">Generated Narrative</h3>
                                <p className="text-sm text-gray-300 italic whitespace-pre-wrap">{manifestation.fullScript}</p>
                                <ManifestationPlayer manifestation={manifestation} setActiveClipIndex={setActiveClipIndex} />
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