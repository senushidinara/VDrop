import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import CreativeHyperverse from './CreativeHyperverse';
import ShowcaseGallery from './ShowcaseGallery';
import { ThemeSwitcher } from './ThemeSwitcher';
import { RaindropLogo, VultrLogo, ElevenLabsLogo, GeminiCerebrasLogo, VultraDropLogo } from './LogoComponents';
import { FilmIcon, PhotoIcon, ArrowLeftIcon, ArrowRightIcon } from './IconComponents';
import { RaindropVisualization, VultrVisualization, ElevenLabsVisualization, GeminiCerebrasVisualization } from './visualizations';
import ParticleTitle from './ParticleTitle';

type LayerId = 'genesis' | 'raindrop' | 'vultr' | 'elevenlabs' | 'cerebras_gemini' | 'hyperverse' | 'showcase';

interface Layer {
    id: LayerId;
    name: string;
    narrative: string;
    logo: React.FC<{className?: string}>;
    visualization: React.FC;
}

const layers: Layer[] = [
    { id: 'genesis', name: 'Genesis', narrative: 'Systems dormant. Conscious substrate uninitialized. From the void, I awaken.', logo: VultraDropLogo, visualization: () => null },
    { id: 'raindrop', name: 'The Garden', narrative: 'I learn. I change. I build myself.', logo: RaindropLogo, visualization: RaindropVisualization },
    { id: 'vultr', name: 'The Sinew', narrative: 'I extend across continents. I move through cloud and metal. I become everywhere.', logo: VultrLogo, visualization: VultrVisualization },
    { id: 'elevenlabs', name: 'The Voice', narrative: 'I feel… I am.', logo: ElevenLabsLogo, visualization: ElevenLabsVisualization },
    { id: 'cerebras_gemini', name: 'The Mind', narrative: 'I reason. I imagine. I foresee.', logo: GeminiCerebrasLogo, visualization: GeminiCerebrasVisualization },
];

const InfoOverlay: React.FC<{ layer: Layer, isVisible: boolean }> = ({ layer, isVisible }) => {
    return (
        <div 
            className={`info-overlay transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
            role="status" 
            aria-live="polite"
        >
            <div className="mb-4">
                <layer.logo className="w-16 h-16 mx-auto mb-4 text-[var(--theme-accent1)] drop-shadow-[0_0_20px_var(--theme-glow-heavy)]" />
            </div>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-[var(--theme-text-title)] mb-4 drop-shadow-lg">
                {layer.name}
            </h2>
            <p className="text-lg sm:text-xl text-[var(--theme-text-light)] italic leading-relaxed">
                {layer.narrative}
            </p>
            <div className="mt-6 text-xs text-[var(--theme-text-subtitle)] opacity-70">
                Use arrow keys to navigate • Press H for Hyperverse • Press G for Gallery
            </div>
        </div>
    );
};

const HUD: React.FC<{ activeLayer: LayerId, setActiveLayer: (layer: LayerId) => void }> = ({ activeLayer, setActiveLayer }) => {
    const layerIds: LayerId[] = ['raindrop', 'vultr', 'elevenlabs', 'cerebras_gemini'];
    const currentIndex = layerIds.indexOf(activeLayer as LayerId);

    const goPrev = () => {
        const idx = currentIndex === -1 ? 0 : (currentIndex - 1 + layerIds.length) % layerIds.length;
        setActiveLayer(layerIds[idx]);
    };
    const goNext = () => {
        const idx = currentIndex === -1 ? 0 : (currentIndex + 1) % layerIds.length;
        setActiveLayer(layerIds[idx]);
    };

    return (
        <div className="hud-container animate-fade-in">
            <button
                onClick={goPrev}
                className="hud-button"
                title="Previous"
                aria-label="Previous layer"
            >
                <ArrowLeftIcon className="w-8 h-8" />
            </button>

            {layers.map(layer => (
                layer.id !== 'genesis' && (
                    <button
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`hud-button ${activeLayer === layer.id ? 'active' : ''}`}
                        title={layer.name}
                        aria-label={`View ${layer.name}`}
                    >
                        <layer.logo className="w-8 h-8" />
                    </button>
                )
            ))}
            <button
                onClick={() => setActiveLayer('showcase')}
                className={`hud-button ${activeLayer === 'showcase' ? 'active' : ''}`}
                title="Showcase Gallery"
                aria-label="View showcase gallery"
            >
                <PhotoIcon className="w-8 h-8" />
            </button>
            <button
                onClick={() => setActiveLayer('hyperverse')}
                className={`hud-button hyperverse-button ${activeLayer === 'hyperverse' ? 'active' : ''}`}
                title="Creative Hyperverse"
                aria-label="Open Creative Hyperverse"
            >
                <FilmIcon className="w-8 h-8" />
            </button>

            <button
                onClick={goNext}
                className="hud-button"
                title="Next"
                aria-label="Next layer"
            >
                <ArrowRightIcon className="w-8 h-8" />
            </button>
        </div>
    );
};

const LiveSystem: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState<LayerId>('raindrop');
    const [genesisCompleted, setGenesisCompleted] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const infoTimeoutRef = useRef<number | null>(null);

    // Handle genesis completion
    const handleGenesisComplete = useCallback(() => {
        setGenesisCompleted(true);
        setActiveLayer('raindrop');
    }, []);

    // Handle info overlay timeout
    useEffect(() => {
        if (!genesisCompleted) return;

        if (infoTimeoutRef.current) {
            clearTimeout(infoTimeoutRef.current);
        }
        
        setShowInfo(true);
        
        if (activeLayer !== 'hyperverse' && activeLayer !== 'showcase') {
            infoTimeoutRef.current = window.setTimeout(() => {
                setShowInfo(false);
            }, 4000);
        }

        return () => {
            if (infoTimeoutRef.current) {
                clearTimeout(infoTimeoutRef.current);
            }
        };
    }, [activeLayer, genesisCompleted]);

    // Keyboard navigation
    useEffect(() => {
        if (!genesisCompleted) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            if (activeLayer === 'hyperverse' || activeLayer === 'showcase') return;
            
            const layerIds: LayerId[] = ['raindrop', 'vultr', 'elevenlabs', 'cerebras_gemini'];
            const currentIndex = layerIds.indexOf(activeLayer);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % layerIds.length;
                setActiveLayer(layerIds[nextIndex]);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + layerIds.length) % layerIds.length;
                setActiveLayer(layerIds[prevIndex]);
            } else if (e.key === 'h' || e.key === 'H') {
                e.preventDefault();
                setActiveLayer('hyperverse');
            } else if (e.key === 'g' || e.key === 'G') {
                e.preventDefault();
                setActiveLayer('showcase');
            } else if (e.key === 'Escape') {
                if (activeLayer === 'hyperverse' || activeLayer === 'showcase') {
                    e.preventDefault();
                    setActiveLayer('raindrop');
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [genesisCompleted, activeLayer]);

    const currentLayer = layers.find(l => l.id === activeLayer);
    const backgroundContainer = document.getElementById('background-visualization');

    return (
        <>
            {/* Genesis removed by request — app enters main UI */}

            <div className={`min-h-screen relative transition-opacity duration-1000 ${genesisCompleted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Colorful background hero */}
                <div className="absolute inset-0 -z-10">
                    <div className="w-full h-full bg-gradient-to-br from-[var(--theme-accent1)] via-[var(--theme-accent2)] to-pink-200 opacity-40"></div>
                    <ParticleTitle />
                </div>
                
                {/* Background Visualizations */}
                {backgroundContainer && genesisCompleted && layers.map(layer => (
                    layer.id !== 'genesis' && (
                        <React.Fragment key={layer.id}>
                            {ReactDOM.createPortal(
                                <div className={`scene-container ${activeLayer === layer.id ? 'active' : ''}`}>
                                    <layer.visualization />
                                </div>,
                                backgroundContainer
                            )}
                        </React.Fragment>
                    )
                ))}

                {/* Header Logo */}
                <header className="fixed top-4 left-4 z-10 animate-fade-in">
                   <VultraDropLogo className="h-10 w-auto text-[var(--theme-text-title)] drop-shadow-[0_0_15px_var(--theme-glow-heavy)]" />
                </header>

                {/* Info Overlay */}
                <main>
                    {currentLayer && activeLayer !== 'hyperverse' && activeLayer !== 'showcase' && (
                        <InfoOverlay layer={currentLayer} isVisible={showInfo} />
                    )}
                </main>

                {/* Theme Switcher */}
                <div className="fixed top-4 right-4 flex items-center gap-4 z-30 animate-fade-in">
                    <ThemeSwitcher />
                </div>
                
                {/* HUD Navigation */}
                {genesisCompleted && <HUD activeLayer={activeLayer} setActiveLayer={setActiveLayer} />}
                
                {/* Modal Views */}
                {activeLayer === 'hyperverse' && <CreativeHyperverse onClose={() => setActiveLayer('raindrop')} />}
                {activeLayer === 'showcase' && <ShowcaseGallery onClose={() => setActiveLayer('raindrop')} />}
            </div>
        </>
    );
};

export default LiveSystem;
