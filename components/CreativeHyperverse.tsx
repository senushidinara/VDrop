
import React, { useState } from 'react';
import { useManifestationEngine } from '../hooks/useManifestationEngine';
import { useCinematicPlayer } from '../hooks/useCinematicPlayer';
import { AspectRatio, ImageSettings } from '../types';
import ClipDisplay from './VideoPlayer';
import Loader from './Loader';
import { FilmIcon, RefreshIcon, SpeakerWaveIcon } from './IconComponents';

interface CreativeHyperverseProps {
    onClose: () => void;
}

const ASPECT_RATIOS: AspectRatio[] = ['16:9', '1:1', '9:16', '4:3', '3:4'];

const CreativeHyperverse: React.FC<CreativeHyperverseProps> = ({ onClose }) => {
    const [vision, setVision] = useState('');
    const [settings, setSettings] = useState<ImageSettings>({ aspectRatio: '16:9' });

    const { manifestation, isGenerating, error, manifestVision, resetManifestation } = useManifestationEngine();
    const { isPlaying, activeClipIndex, play, stop } = useCinematicPlayer(manifestation);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (vision.trim() && !isGenerating) {
            manifestVision(vision, settings);
        }
    };
    
    const handleReset = () => {
        stop();
        resetManifestation();
        setVision('');
    }

    const handleDownloadClip = (urls: string[], id: number) => {
        // This is a simplified download, in a real app you might zip them.
        urls.forEach((url, index) => {
            const link = document.createElement('a');
            link.href = url;
            link.download = `VultraDrop-Clip-${id + 1}-Frame-${index + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const hasCompletedClips = manifestation?.clips.some(c => c.status === 'completed');

    return (
        <div className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in-fast">
            {isGenerating && <Loader />}
            
            <header className="flex justify-between items-start mb-4">
                <div>
                     <h1 className="text-2xl sm:text-3xl font-bold font-orbitron text-[var(--theme-text-title)]">Creative Hyperverse</h1>
                    <p className="text-sm sm:text-base text-[var(--theme-text-subtitle)]">Manifest a cinematic trailer from your vision.</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-[var(--theme-bg-hover)] transition-colors"
                    title="Close Hyperverse"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </header>

            <main className="flex-grow flex flex-col overflow-hidden">
                {!manifestation ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto w-full pt-10">
                        <textarea
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            placeholder="Describe your vision... e.g., 'An epic space opera about a lone astronaut discovering a lost alien civilization.'"
                            className="w-full h-40 p-4 bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-color)] rounded-lg focus:ring-2 focus:ring-[var(--theme-accent1)] focus:border-[var(--theme-accent1)] transition-colors"
                            required
                        />
                         <div className="flex flex-col sm:flex-row gap-4 items-center">
                             <label className="font-semibold text-sm">Aspect Ratio:</label>
                             <div className="flex gap-2 bg-[var(--theme-bg-secondary)] p-1 rounded-md">
                                {ASPECT_RATIOS.map(ratio => (
                                    <button
                                        key={ratio}
                                        type="button"
                                        onClick={() => setSettings({ ...settings, aspectRatio: ratio })}
                                        className={`px-3 py-1 text-xs rounded ${settings.aspectRatio === ratio ? 'bg-[var(--theme-accent1)] text-white' : 'hover:bg-[var(--theme-bg-hover)]'}`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" disabled={isGenerating || !vision.trim()} className="genesis-button w-full sm:w-auto self-center mt-4 py-3 px-12 bg-cyan-400 text-black font-bold rounded-lg hover:bg-white transition-all transform hover:scale-105 font-orbitron text-xl awaken-button-glow disabled:opacity-50 disabled:cursor-not-allowed">
                            MANIFEST
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col flex-grow overflow-hidden">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4 p-4 bg-[var(--theme-bg-secondary)] rounded-lg border border-[var(--theme-border-color)]">
                            <p className="text-sm italic flex-1 min-w-[200px]"><strong>Vision:</strong> {manifestation.vision}</p>
                            <div className="flex items-center gap-4">
                                {hasCompletedClips && !isPlaying && (
                                    <button onClick={play} className="flex items-center gap-2 px-4 py-2 bg-green-500/80 text-white rounded-lg hover:bg-green-500 transition-colors">
                                        <FilmIcon className="w-5 h-5" /> Play Trailer
                                    </button>
                                )}
                                {isPlaying && (
                                    <button onClick={stop} className="flex items-center gap-2 px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors">
                                        <SpeakerWaveIcon className="w-5 h-5" /> Stop
                                    </button>
                                )}
                                <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-gray-500/80 text-white rounded-lg hover:bg-gray-500 transition-colors">
                                    <RefreshIcon className="w-5 h-5" /> New Vision
                                </button>
                            </div>
                        </div>
                        
                        {error && <p className="text-red-400 text-center p-4 bg-red-900/50 rounded-lg">{error}</p>}

                        <div className="flex-grow overflow-y-auto pr-2">
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {manifestation.clips.map((clip, index) => (
                                    <ClipDisplay 
                                        key={clip.id} 
                                        clip={clip}
                                        onDownload={handleDownloadClip}
                                        isActive={isPlaying && activeClipIndex === index}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CreativeHyperverse;
