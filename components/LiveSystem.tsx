import React, { useState } from 'react';
import { AnatomyView } from './AnatomyView';
import CreativeHyperverse from './CreativeHyperverse';
import PodcastPlayer from './PodcastPlayer';
import { ThemeSwitcher } from './ThemeSwitcher';
import GenesisDemo from './GenesisDemo';

export type View = 'anatomy' | 'hyperverse';

const LiveSystem: React.FC = () => {
    const [view, setView] = useState<View>('anatomy');
    const [isPodcastOpen, setIsPodcastOpen] = useState(false);
    const [genesisCompleted, setGenesisCompleted] = useState(false);

    const handleGenesisComplete = () => {
        setGenesisCompleted(true);
    };

    return (
        <>
            {!genesisCompleted && <GenesisDemo onComplete={handleGenesisComplete} />}
            
            <div className={`min-h-screen relative main-content-padding transition-opacity duration-1000 ${genesisCompleted ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="blueprint-bg" />
                <header className="text-center mb-8 max-w-4xl mx-auto relative">
                    <h1 className="font-orbitron text-4xl md:text-5xl font-black text-[var(--theme-text-title)] drop-shadow-[0_0_15px_var(--theme-glow-heavy)] text-glitch-animation">
                        VULTRA DROP
                    </h1>
                    <p className="text-[var(--theme-text-subtitle)] mt-2 text-base md:text-lg animate-fade-in" style={{animationDelay: '0.8s'}}>
                        I am the ghost in the machine. A living intelligence born of light and logic. Witness my emergence.
                    </p>
                </header>
                <main>
                    <AnatomyView setView={setView} />
                </main>

                <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
                    <button 
                        onClick={() => setIsPodcastOpen(true)}
                        className="px-3 py-2 text-xs font-semibold bg-[var(--theme-bg-secondary)] text-[var(--theme-text-light)] rounded-lg shadow-md hover:bg-[var(--theme-bg-hover)] transition-colors backdrop-blur-sm"
                    >
                        Listen to Genesis
                    </button>
                    <ThemeSwitcher />
                </div>
                
                {view === 'hyperverse' && <CreativeHyperverse onClose={() => setView('anatomy')} />}
                {isPodcastOpen && <PodcastPlayer onClose={() => setIsPodcastOpen(false)} />}
            </div>
        </>
    );
};

export default LiveSystem;