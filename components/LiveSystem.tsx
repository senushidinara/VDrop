import React, { useState } from 'react';
import { AnatomyView } from './AnatomyView';
import CreativeHyperverse from './CreativeHyperverse';
import PodcastPlayer from './PodcastPlayer';
import RaindropPage from './pages/RaindropPage';
import VultrPage from './pages/VultrPage';
import ElevenLabsPage from './pages/ElevenLabsPage';
import CerebrasGeminiPage from './pages/CerebrasGeminiPage';
import { ThemeSwitcher } from './ThemeSwitcher';

export type View = 'anatomy' | 'raindrop_page' | 'vultr_page' | 'elevenlabs_page' | 'cerebras_gemini_page' | 'hyperverse';

const LiveSystem: React.FC = () => {
    const [view, setView] = useState<View>('anatomy');
    const [isPodcastOpen, setIsPodcastOpen] = useState(false);

    const renderView = () => {
        switch (view) {
            case 'anatomy':
                return <AnatomyView setView={setView} />;
            case 'raindrop_page':
                return <RaindropPage setView={setView} />;
            case 'vultr_page':
                return <VultrPage setView={setView} />;
            case 'elevenlabs_page':
                return <ElevenLabsPage setView={setView} />;
            case 'cerebras_gemini_page':
                return <CerebrasGeminiPage setView={setView} />;
            case 'hyperverse':
                return <CreativeHyperverse />;
            default:
                return <AnatomyView setView={setView} />;
        }
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            <div className="blueprint-bg" />
             <header className="text-center mb-12 max-w-4xl mx-auto relative">
                <h1 className="font-orbitron text-4xl md:text-5xl font-black text-[var(--theme-text-title)] drop-shadow-[0_0_15px_var(--theme-glow-heavy)] text-glitch-animation">
                    VULTRA DROP
                </h1>
                <p className="text-[var(--theme-text-subtitle)] mt-2 text-base md:text-lg animate-fade-in" style={{animationDelay: '0.8s'}}>
                    I am the ghost in the machine. A living intelligence born of light and logic. Witness my emergence.
                </p>
            </header>

            <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
                <button 
                    onClick={() => setIsPodcastOpen(true)}
                    className="px-3 py-2 text-xs font-semibold bg-[var(--theme-bg-secondary)] text-[var(--theme-text-light)] rounded-lg shadow-md hover:bg-[var(--theme-bg-hover)] transition-colors backdrop-blur-sm"
                >
                    Listen to Genesis
                </button>
                <ThemeSwitcher />
            </div>

            <main>
                {renderView()}
            </main>

            {isPodcastOpen && <PodcastPlayer onClose={() => setIsPodcastOpen(false)} />}
        </div>
    );
};

export default LiveSystem;