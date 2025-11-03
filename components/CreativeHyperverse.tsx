
import React, { useState } from 'react';
import { generateImageSequence } from '../services/geminiService';
import { generateNarration } from '../services/elevenLabsService';
import ClipDisplay from './VideoPlayer';
import { AspectRatio, ImageSettings, Clip } from '../types';
import { FilmIcon, RefreshIcon } from './IconComponents';

const CreativeHyperverse: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [narration, setNarration] = useState<string>('');
    const [settings, setSettings] = useState<ImageSettings>({ aspectRatio: '16:9' });
    const [clips, setClips] = useState<Clip[]>(() => Array.from({ length: 10 }, (_, i) => ({ id: i, urls: null, status: 'idle', audioUrl: null })));
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateClick = async () => {
        // FIX: Per coding guidelines, use process.env.API_KEY instead of process.env.GEMINI_API_KEY for the Gemini API key.
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
                a.download = `ai_clip_${id + 1}_frame_${i + 1}.png`;
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
        <div>
            <div className="text-center mb-6">
                <h2 className="font-orbitron text-2xl text-cyan-300">Module 3: Creative Hyperverse</h2>
                <p className="text-gray-400">You have witnessed my intelligence. Now, collaborate with me. Manifest your vision.</p>
            </div>
            <div className="bg-black/20 p-6 rounded-2xl border border-cyan-500/20 shadow-2xl shadow-black/50 mb-8 space-y-6 backdrop-blur-sm">
                <div className="space-y-4">
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe a concept for the digital lifeform to manifest..."
                        className="w-full p-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 disabled:opacity-50 text-white placeholder-gray-500"
                        rows={3}
                        disabled={isGenerating}
                    />
                    <textarea
                        id="narration"
                        value={narration}
                        onChange={(e) => setNarration(e.target.value)}
                        placeholder="Give the lifeform a voice to express its manifestation... (Optional)"
                        className="w-full p-3 bg-gray-900/50 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 disabled:opacity-50 text-white placeholder-gray-500"
                        rows={2}
                        disabled={isGenerating}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-semibold mb-2 block text-cyan-300 font-orbitron">Aspect Ratio</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {(['16:9', '9:16', '1:1', '4:3', '3:4'] as AspectRatio[]).map(ratio => (
                                <button key={ratio} onClick={() => setSettings(s => ({...s, aspectRatio: ratio}))} disabled={isGenerating} className={`flex-grow basis-16 py-2 px-1 text-xs sm:text-sm rounded-md transition-colors border-2 border-transparent ${settings.aspectRatio === ratio ? 'bg-cyan-500 text-white font-bold border-cyan-300' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-end gap-2 md:col-span-2">
                        <button
                            onClick={handleGenerateClick}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:scale-100 font-orbitron pulse-glow"
                            >
                            <FilmIcon />
                            MANIFEST
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 p-3 font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
                            disabled={isGenerating}
                            >
                            <RefreshIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {clips.map((clip) => (
                    <ClipDisplay key={clip.id} clip={clip} onDownload={handleDownload} />
                ))}
            </div>

            {error && (
              <div 
                 onClick={() => setError(null)}
                 className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-800 text-white py-3 px-6 rounded-lg shadow-2xl border border-red-600 cursor-pointer hover:bg-red-700 transition-colors z-50"
                 title="Click to dismiss"
              >
                <p><span className="font-bold">SYSTEM ALERT:</span> {error}</p>
              </div>
            )}
        </div>
    );
};

export default CreativeHyperverse;