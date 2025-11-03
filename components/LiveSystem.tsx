import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import CreativeHyperverse from './CreativeHyperverse';
import ShowcaseGallery from './ShowcaseGallery';
import { ThemeSwitcher } from './ThemeSwitcher';
import { RaindropLogo, VultrLogo, ElevenLabsLogo, GeminiCerebrasLogo, VultraDropLogo } from './LogoComponents';
import { FilmIcon, PhotoIcon, ArrowLeftIcon, ArrowRightIcon } from './IconComponents';
import { RaindropVisualization, VultrVisualization, ElevenLabsVisualization, GeminiCerebrasVisualization } from './visualizations';
import ParticleTitle from './ParticleTitle';
import useFakeManifest, { ManifestOverlay } from './Manifestation';

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
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[580px] w-[88%] text-center transition-all duration-700 z-40 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            role="status" 
            aria-live="polite"
        >
            <div className="bg-white/75 backdrop-blur-md border border-cyan-200/25 rounded-2xl p-8 shadow-lg">
                <div className="mb-5">
                    <layer.logo className="w-16 h-16 mx-auto mb-3 text-[var(--theme-accent1)] drop-shadow-[0_0_12px_var(--theme-glow-light)]" />
                </div>
                <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
                    {layer.name}
                </h2>
                <p className="text-base text-slate-600 italic leading-relaxed mb-4">
                    {layer.narrative}
                </p>
                <div className="mt-5 text-xs text-slate-500 opacity-80">
                    Use arrow keys to navigate • Press H for Hyperverse • Press G for Gallery
                </div>
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 flex gap-3 px-4 py-3 bg-white/90 backdrop-blur-md border border-cyan-200/20 rounded-full shadow-lg">
            <button
                onClick={goPrev}
                className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border border-slate-200/50 transition-all duration-300 bg-white hover:bg-cyan-50 hover:shadow-md text-cyan-500 hover:-translate-y-1"
                title="Previous"
                aria-label="Previous layer"
            >
                <ArrowLeftIcon className="w-7 h-7" />
            </button>

            {layers.map(layer => (
                layer.id !== 'genesis' && (
                    <button
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border ${
                            activeLayer === layer.id
                                ? 'bg-gradient-to-br from-cyan-300 to-pink-300 text-white border-cyan-400 shadow-md -translate-y-1'
                                : 'bg-white text-cyan-500 border-slate-200/50 hover:bg-cyan-50 hover:-translate-y-1 hover:shadow-md'
                        }`}
                        title={layer.name}
                        aria-label={`View ${layer.name}`}
                    >
                        <layer.logo className="w-6 h-6" />
                    </button>
                )
            ))}
            <button
                onClick={() => setActiveLayer('showcase')}
                className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border ${
                    activeLayer === 'showcase'
                        ? 'bg-gradient-to-br from-cyan-300 to-pink-300 text-white border-cyan-400 shadow-md -translate-y-1'
                        : 'bg-white text-cyan-500 border-slate-200/50 hover:bg-cyan-50 hover:-translate-y-1 hover:shadow-md'
                }`}
                title="Showcase Gallery"
                aria-label="View showcase gallery"
            >
                <PhotoIcon className="w-6 h-6" />
            </button>
            <button
                onClick={() => setActiveLayer('hyperverse')}
                className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border ${
                    activeLayer === 'hyperverse'
                        ? 'bg-gradient-to-br from-cyan-300 to-pink-300 text-white border-cyan-400 shadow-md -translate-y-1'
                        : 'bg-gradient-to-br from-cyan-200 to-pink-200 text-white border-cyan-300 shadow-sm hover:-translate-y-1 hover:shadow-md'
                }`}
                title="Creative Hyperverse"
                aria-label="Open Creative Hyperverse"
            >
                <FilmIcon className="w-6 h-6" />
            </button>

            <button
                onClick={goNext}
                className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border border-slate-200/50 transition-all duration-300 bg-white hover:bg-cyan-50 hover:shadow-md text-cyan-500 hover:-translate-y-1"
                title="Next"
                aria-label="Next layer"
            >
                <ArrowRightIcon className="w-7 h-7" />
            </button>
        </div>
    );
};

const LiveSystem: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState<LayerId>('raindrop');
    const [genesisCompleted, setGenesisCompleted] = useState(true);
    const [showInfo, setShowInfo] = useState(true);
    const infoTimeoutRef = useRef<number | null>(null);
    const [backgroundContainer, setBackgroundContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setBackgroundContainer(document.getElementById('background-visualization'));
    }, []);

    // Handle info overlay timeout
    useEffect(() => {
        if (infoTimeoutRef.current) {
            clearTimeout(infoTimeoutRef.current);
        }
        
        setShowInfo(true);
        
        if (activeLayer !== 'hyperverse' && activeLayer !== 'showcase') {
            infoTimeoutRef.current = window.setTimeout(() => {
                setShowInfo(false);
            }, 5000);
        }

        return () => {
            if (infoTimeoutRef.current) {
                clearTimeout(infoTimeoutRef.current);
            }
        };
    }, [activeLayer]);

    // Keyboard navigation
    useEffect(() => {
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
    }, [activeLayer]);

    const currentLayer = layers.find(l => l.id === activeLayer);

    return (
        <>
            <div className="min-h-screen relative bg-gradient-to-br from-cyan-100 via-pink-100 to-purple-100">
                {/* Particle Title Background */}
                <div className="absolute inset-0 z-0 opacity-60">
                    <ParticleTitle />
                </div>

                {/* Background Visualizations: try portal, fallback to inline rendering if container missing */}
                {layers.map(layer => (
                    layer.id !== 'genesis' && (
                        <React.Fragment key={layer.id}>
                            {backgroundContainer ? (
                                ReactDOM.createPortal(
                                    <div className={`scene-container ${activeLayer === layer.id ? 'active' : ''}`}>
                                        <layer.visualization />
                                    </div>,
                                    backgroundContainer
                                )
                            ) : (
                                <div className={`scene-container ${activeLayer === layer.id ? 'active' : ''} absolute inset-0 z-0`}>
                                    <layer.visualization />
                                </div>
                            )}
                        </React.Fragment>
                    )
                ))}

                {/* Header Logo */}
                <header className="fixed top-4 left-4 z-20 animate-fade-in">
                   <VultraDropLogo className="h-10 w-auto text-cyan-600 drop-shadow-[0_0_10px_rgba(125,211,252,0.4)]" />
                </header>

                {/* Theme Switcher */}
                <div className="fixed top-4 right-4 flex items-center gap-4 z-20 animate-fade-in">
                    <ThemeSwitcher />
                </div>

                {/* Info Overlay */}
                {currentLayer && activeLayer !== 'hyperverse' && activeLayer !== 'showcase' && (
                    <InfoOverlay layer={currentLayer} isVisible={showInfo} />
                )}
                
                {/* HUD Navigation */}
                <HUD activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
                
                {/* Modal Views */}
                {activeLayer === 'hyperverse' && <CreativeHyperverse onClose={() => setActiveLayer('raindrop')} />}
                {activeLayer === 'showcase' && <ShowcaseGallery onClose={() => setActiveLayer('raindrop')} />}
            </div>
        </>
    );
};

export default LiveSystem;
