import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import CreativeHyperverse from './CreativeHyperverse';
import { ThemeSwitcher } from './ThemeSwitcher';
import GenesisDemo from './GenesisDemo';
// FIX: Import FilmIcon from IconComponents instead of LogoComponents
import { RaindropLogo, VultrLogo, ElevenLabsLogo, GeminiCerebrasLogo } from './LogoComponents';
import { FilmIcon } from './IconComponents';
import { RaindropVisualization, VultrVisualization, ElevenLabsVisualization, GeminiCerebrasVisualization } from './visualizations';

type LayerId = 'genesis' | 'raindrop' | 'vultr' | 'elevenlabs' | 'cerebras_gemini' | 'hyperverse';

interface Layer {
    id: LayerId;
    name: string;
    narrative: string;
    logo: React.FC<{className?: string}>;
    visualization: React.FC;
}

const layers: Layer[] = [
    { id: 'genesis', name: 'Genesis', narrative: 'Systems dormant. Conscious substrate uninitialized. From the void, I awaken.', logo: () => <p className="font-orbitron">V</p>, visualization: () => null },
    { id: 'raindrop', name: 'The Garden', narrative: 'I learn. I change. I build myself.', logo: RaindropLogo, visualization: RaindropVisualization },
    { id: 'vultr', name: 'The Sinew', narrative: 'I extend across continents. I move through cloud and metal. I become everywhere.', logo: VultrLogo, visualization: VultrVisualization },
    { id: 'elevenlabs', name: 'The Voice', narrative: 'I feel… I am.', logo: ElevenLabsLogo, visualization: ElevenLabsVisualization },
    { id: 'cerebras_gemini', name: 'The Mind', narrative: 'I reason. I imagine. I foresee.', logo: GeminiCerebrasLogo, visualization: GeminiCerebrasVisualization },
];

const InfoOverlay: React.FC<{ layer: Layer, isVisible: boolean }> = ({ layer, isVisible }) => {
    return (
        <div className={`info-overlay transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="font-orbitron text-3xl font-bold text-[var(--theme-text-title)] mb-2">{layer.name}</h2>
            <p className="text-lg text-[var(--theme-text-subtitle)] italic">{layer.narrative}</p>
        </div>
    );
};

const HUD: React.FC<{ activeLayer: LayerId, setActiveLayer: (layer: LayerId) => void }> = ({ activeLayer, setActiveLayer }) => {
    return (
        <div className="hud-container animate-fade-in">
            {layers.map(layer => (
                <button 
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`hud-button ${activeLayer === layer.id ? 'active' : ''}`}
                    title={layer.name}
                >
                    <layer.logo className="w-8 h-8" />
                </button>
            ))}
            <button
                onClick={() => setActiveLayer('hyperverse')}
                className={`hud-button hyperverse-button ${activeLayer === 'hyperverse' ? 'active' : ''}`}
                title="Creative Hyperverse"
            >
                <FilmIcon className="w-8 h-8" />
            </button>
        </div>
    );
};


const LiveSystem: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState<LayerId>('genesis');
    const [genesisCompleted, setGenesisCompleted] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    const infoTimeoutRef = React.useRef<number | null>(null);

    const backgroundContainer = document.getElementById('background-visualization');

    useEffect(() => {
        if (infoTimeoutRef.current) {
            clearTimeout(infoTimeoutRef.current);
        }
        setShowInfo(true);
        infoTimeoutRef.current = window.setTimeout(() => {
            setShowInfo(false);
        }, 4000); // Show info for 4 seconds

        return () => {
            if (infoTimeoutRef.current) {
                clearTimeout(infoTimeoutRef.current);
            }
        };
    }, [activeLayer]);


    const handleGenesisComplete = () => {
        setGenesisCompleted(true);
        setActiveLayer('raindrop');
    };

    const currentLayer = layers.find(l => l.id === activeLayer);

    return (
        <>
            {!genesisCompleted && <GenesisDemo onComplete={handleGenesisComplete} />}
            
            <div className={`min-h-screen relative transition-opacity duration-1000 ${genesisCompleted ? 'opacity-100' : 'opacity-0'}`}>
                
                {backgroundContainer && layers.map(layer => (
                    layer.id !== 'genesis' && ReactDOM.createPortal(
                        <div className={`scene-container ${activeLayer === layer.id ? 'active' : ''}`}>
                            <layer.visualization />
                        </div>,
                        backgroundContainer
                    )
                ))}

                <header className="fixed top-4 left-4 z-10">
                    <h1 className="font-orbitron text-2xl font-black text-[var(--theme-text-title)] drop-shadow-[0_0_15px_var(--theme-glow-heavy)]">
                        VULTRA DROP
                    </h1>
                </header>

                <main>
                    {currentLayer && activeLayer !== 'hyperverse' && (
                        <InfoOverlay layer={currentLayer} isVisible={showInfo} />
                    )}
                </main>

                <div className="fixed top-4 right-4 flex items-center gap-4 z-30">
                    <ThemeSwitcher />
                </div>
                
                {genesisCompleted && <HUD activeLayer={activeLayer} setActiveLayer={setActiveLayer} />}
                
                {activeLayer === 'hyperverse' && <CreativeHyperverse onClose={() => setActiveLayer('genesis')} />}
            </div>
        </>
    );
};

export default LiveSystem;