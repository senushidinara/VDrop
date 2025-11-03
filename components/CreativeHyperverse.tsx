
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
    const { isPlaying, activeClipIndex, play, stop } = useCinematicPlayer(manifestation, isGenerating);

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
        <div className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in-fast overflow-y-auto">
            {isGenerating && <Loader />}
            
            <header className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="animate-slide-up">
                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-orbitron text-[var(--theme-text-title)] mb-2">
                        Creative Hyperverse
                    </h1>
                    <p className="text-sm sm:text-base text-[var(--theme-text-subtitle)]">
                        Manifest a cinematic trailer from your vision.
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-[var(--theme-bg-hover)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)] hover:scale-110"
                    title="Close Hyperverse"
                    aria-label="Close Creative Hyperverse"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </header>

            <main className="flex-grow flex flex-col overflow-hidden">
                {!manifestation ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6 max-w-2xl mx-auto w-full pt-10 animate-slide-up">
                        <div className="relative">
                            <textarea
                                value={vision}
                                onChange={(e) => setVision(e.target.value)}
                                placeholder="Describe your vision... e.g., 'An epic space opera about a lone astronaut discovering a lost alien civilization.'"
                                className="w-full h-40 p-4 bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-color)] rounded-lg focus:ring-2 focus:ring-[var(--theme-accent1)] focus:border-[var(--theme-accent1)] transition-all duration-300 resize-none text-[var(--theme-text-light)] placeholder:text-[var(--theme-text-subtitle)]"
                                required
                                aria-label="Vision description"
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-[var(--theme-text-subtitle)]">
                                {vision.length} characters
                            </div>
                        </div>
                         <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                             <label className="font-semibold text-sm text-[var(--theme-text-light)]" htmlFor="aspect-ratio-group">
                                Aspect Ratio:
                            </label>
                             <div id="aspect-ratio-group" role="group" aria-label="Aspect ratio selection" className="flex gap-2 bg-[var(--theme-bg-secondary)] p-1 rounded-md border border-[var(--theme-border-color)]">
                                {ASPECT_RATIOS.map(ratio => (
                                    <button
                                        key={ratio}
                                        type="button"
                                        onClick={() => setSettings({ ...settings, aspectRatio: ratio })}
                                        className={`px-3 py-1 text-xs rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)] ${settings.aspectRatio === ratio ? 'bg-[var(--theme-accent1)] text-white shadow-lg' : 'hover:bg-[var(--theme-bg-hover)] text-[var(--theme-text-light)]'}`}
                                        aria-pressed={settings.aspectRatio === ratio}
                                        aria-label={`Select ${ratio} aspect ratio`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isGenerating || !vision.trim()} 
                            className="genesis-button w-full sm:w-auto self-center mt-4 py-3 px-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-105 font-orbitron text-xl awaken-button-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
                            aria-label="Manifest your vision"
                        >
                            ✨ MANIFEST ✨
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col flex-grow overflow-hidden animate-fade-in">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-to-r from-[var(--theme-bg-secondary)] to-[var(--theme-bg-tertiary)] rounded-lg border-2 border-[var(--theme-border-color)] shadow-xl">
                            <p className="text-sm sm:text-base italic flex-1 min-w-[200px] text-[var(--theme-text-light)]">
                                <strong className="text-[var(--theme-accent1)] font-orbitron">Vision:</strong> {manifestation.vision}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                {hasCompletedClips && !isPlaying && (
                                    <button 
                                        onClick={play} 
                                        disabled={isGenerating} 
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                        aria-label="Play cinematic trailer"
                                    >
                                        <FilmIcon className="w-5 h-5" /> Play Trailer
                                    </button>
                                )}
                                {isPlaying && (
                                    <button 
                                        onClick={stop} 
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-400 hover:to-rose-500 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                        aria-label="Stop playback"
                                    >
                                        <SpeakerWaveIcon className="w-5 h-5" /> Stop
                                    </button>
                                )}
                                <button 
                                    onClick={handleReset} 
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    aria-label="Create new vision"
                                >
                                    <RefreshIcon className="w-5 h-5" /> New Vision
                                </button>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="text-red-400 text-center p-4 bg-red-900/50 rounded-lg mb-4 border border-red-500/50 animate-slide-up" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
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