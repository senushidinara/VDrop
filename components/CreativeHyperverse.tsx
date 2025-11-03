import React, { useState } from 'react';
import { useManifestationEngine } from '../hooks/useManifestationEngine';
import { useCinematicPlayer } from '../hooks/useCinematicPlayer';
import { AspectRatio, ImageSettings } from '../types';
import ClipDisplay from './VideoPlayer';
import Loader from './Loader';
import { FilmIcon, RefreshIcon } from './IconComponents';

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
    };

    const handleDownloadClip = (urls: string[], id: number) => {
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
        <div className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in-fast overflow-y-auto custom-scrollbar">
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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
                                className="w-full h-40 p-4 bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-color)] rounded-lg focus:ring-2 focus:ring-[var(--theme-accent1)] focus:border-[var(--theme-accent1)] transition-all duration-300 resize-none text-[var(--theme-text-light)] placeholder:text-[var(--theme-text-subtitle)] custom-scrollbar"
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
                                        className={`px-3 py-1 text-xs rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)] ${
                                            settings.aspectRatio === ratio 
                                                ? 'bg-[var(--theme-accent1)] text-white shadow-lg' 
                                                : 'hover:bg-[var(--theme-bg-hover)] text-[var(--theme-text-light)]'
                                        }`}
                                        aria-pressed={settings.aspectRatio === ratio}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!vision.trim() || isGenerating}
                            className="py-3 px-8 bg-gradient-to-r from-[var(--theme-accent1)] to-[var(--theme-accent2)] text-white font-bold rounded-lg hover:shadow-[0_0_30px_var(--theme-glow-heavy)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[var(--theme-accent1)]/50 font-orbitron text-lg"
                            aria-label="Manifest your vision"
                        >
                            <FilmIcon className="inline-block w-6 h-6 mr-2" />
                            MANIFEST
                        </button>

                        {error && (
                            <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200 animate-fade-in">
                                <p className="font-semibold mb-1">Error:</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                    </form>
                ) : (
                    <div className="flex flex-col gap-4 h-full animate-fade-in">
                        <div className="flex flex-wrap gap-2 items-center justify-between">
                            <h2 className="text-xl font-bold text-[var(--theme-text-title)] font-orbitron">
                                {manifestation.vision}
                            </h2>
                            <div className="flex gap-2">
                                {hasCompletedClips && !isPlaying && (
                                    <button
                                        onClick={play}
                                        className="py-2 px-4 bg-[var(--theme-accent1)] text-white rounded-lg hover:bg-[var(--theme-accent2)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)] flex items-center gap-2"
                                        aria-label="Play cinematic trailer"
                                    >
                                        <FilmIcon className="w-5 h-5" />
                                        Play
                                    </button>
                                )}
                                {isPlaying && (
                                    <button
                                        onClick={stop}
                                        className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        aria-label="Stop playback"
                                    >
                                        Stop
                                    </button>
                                )}
                                <button
                                    onClick={handleReset}
                                    className="py-2 px-4 bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-light)] rounded-lg hover:bg-[var(--theme-bg-hover)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)] flex items-center gap-2"
                                    aria-label="Reset and create new vision"
                                >
                                    <RefreshIcon className="w-5 h-5" />
                                    New Vision
                                </button>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {manifestation.clips.map((clip, index) => (
                                    <ClipDisplay
                                        key={clip.id}
                                        clip={clip}
                                        isActive={activeClipIndex === index}
                                        onDownload={() => clip.urls && handleDownloadClip(clip.urls, clip.id)}
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
