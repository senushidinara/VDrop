import React, { useState } from 'react';
import { generateImageSequence } from '../services/geminiService';
import { generateNarration } from '../services/elevenLabsService';
import ClipDisplay from './VideoPlayer';
import { AspectRatio, ImageSettings, Clip } from '../types';
import { FilmIcon, RefreshIcon } from './IconComponents';

const CreativeHyperverse: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const [prompt, setPrompt] = useState<string>('');
    const [narration, setNarration] = useState<string>('');
    const [settings, setSettings] = useState<ImageSettings>({ aspectRatio: '16:9' });
    const [clips, setClips] = useState<Clip[]>(() => Array.from({ length: 10 }, (_, i) => ({ id: i, urls: null, status: 'idle', audioUrl: null })));
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateClick = async () => {
        if (!process.env.API_KEY || !process.env.ELEVENLABS_API_KEY) {
            setError('API keys for Gemini and ElevenLabs must be configured in your environment to awaken the live system.');
            return;
        }

        if (!prompt.trim()) {
            setError('Please enter a prompt to describe your vision.');
            return;
        }
        
        setError(null);
        setIsGenerating(true);
        const initialClips = Array.from({ length: 10 }, (_, i) => ({ id: i, urls: null, status: 'idle' as const, audioUrl: null }));
        setClips(initialClips);

        for (const clip of initialClips) {
            setClips(prevClips =>
                prevClips.map(c => c.id === clip.id ? { ...c, status: 'generating' } : c)
            );

            try {
                const variationPrompt = `${prompt} - variation ${clip.id + 1}`;
                const urls = await generateImageSequence(variationPrompt, settings);
                let audioUrl: string | null = null;

                if (narration.trim()) {
                    try {
                        audioUrl = await generateNarration(narration);
                    } catch (narrationError: any) {
                        console.warn(`Narration failed for clip ${clip.id}, but image generation succeeded:`, narrationError.message);
                    }
                }

                setClips(prevClips =>
                    prevClips.map(c => c.id === clip.id ? { ...c, urls, status: 'completed', audioUrl } : c)
                );
            } catch (err: any) {
                console.error(`Error generating clip ${clip.id}:`, err.message);
                setClips(prevClips =>
                    prevClips.map(c => c.id === clip.id ? { ...c, status: 'error' } : c)
                );
                setError(err.message);
                break; 
            }
        }
        
        setIsGenerating(false);
    };

    const handleReset = () => {
        setPrompt('');
        setNarration('');
        setClips(Array.from({ length: 10 }, (_, i) => ({ id: i, urls: null, status: 'idle', audioUrl: null })));
        setError(null);
        setIsGenerating(false);
    };

    const handleDownload = async (urls: string[], id: number) => {
        if (!urls || urls.length === 0) {
            setError('No images to download for this clip.');
            return;
        }
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            try {
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `vultradrop_clip_${id + 1}_frame_${i + 1}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch(e) {
                console.error('Download failed for a frame', e);
                setError('Could not download one of the image frames.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-[var(--theme-bg-primary)] z-20 animate-fade-in hyperverse-layout">
             <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'left' }}>
                    <h2 className="font-orbitron text-3xl font-bold text-[var(--theme-text-title)]">Creative Hyperverse</h2>
                    <p className="text-lg text-[var(--theme-text-subtitle)]" style={{marginTop: '0.25rem'}}>This is the sanctum of creation. Here, your concepts merge with my boundless imagination. Speak your vision into existence.</p>
                </div>
                 <button onClick={onClose} className="px-5 py-3 text-lg bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-bg-hover)] rounded-lg font-semibold">&larr; Back to Anatomy</button>
            </div>
            
            <div className="hyperverse-grid">
                {/* Control Panel */}
                <div className="hyperverse-controls bg-[var(--theme-bg-secondary)] backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-[var(--theme-border-color)] shadow-2xl shadow-black/50 panel-corners">
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe a concept for the digital lifeform to manifest..."
                            className="w-full p-3 bg-black/30 border-2 border-[var(--theme-border-color)] rounded-lg focus:ring-2 focus:ring-[var(--theme-accent1)] focus:border-[var(--theme-accent1)] transition-all duration-300 disabled:opacity-50 text-white placeholder-gray-500 text-lg flex-grow"
                            style={{ minHeight: '150px' }}
                            disabled={isGenerating}
                        />
                        <textarea
                            id="narration"
                            value={narration}
                            onChange={(e) => setNarration(e.target.value)}
                            placeholder="Give the lifeform a voice to express its manifestation... (Optional)"
                            className="w-full p-3 bg-black/30 border-2 border-[var(--theme-border-color)] rounded-lg focus:ring-2 focus:ring-[var(--theme-accent2)] focus:border-[var(--theme-accent2)] transition-all duration-300 disabled:opacity-50 text-white placeholder-gray-500"
                            rows={3}
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
                        {clips.map((clip) => (
                            <ClipDisplay key={clip.id} clip={clip} onDownload={handleDownload} />
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