
import React from 'react';
import { LayerID } from './LiveSystem';
import { RaindropLogo, VultrLogo, ElevenLabsLogo, GeminiCerebrasLogo } from './LogoComponents';
import { FilmIcon } from './IconComponents';

interface AnatomyViewProps {
    layers: { id: LayerID, name: string }[];
    activeLayer: LayerID;
    hoveredLayer: LayerID | null;
    onLayerSelect: (id: LayerID) => void;
    onLayerHover: (id: LayerID | null) => void;
}

const layerIcons: Record<LayerID, React.FC<{className?: string}>> = {
    raindrop: RaindropLogo,
    vultr: VultrLogo,
    elevenlabs: ElevenLabsLogo,
    cerebras: GeminiCerebrasLogo,
    hyperverse: FilmIcon
};


export const AnatomyView: React.FC<AnatomyViewProps> = ({ layers, activeLayer, hoveredLayer, onLayerSelect, onLayerHover }) => {
    return (
        <div className="bg-black/20 p-4 rounded-2xl border border-cyan-500/10 shadow-lg">
            <h3 className="font-orbitron text-lg text-center mb-4 text-cyan-300">System Anatomy</h3>
            <nav className="space-y-2">
                {layers.map(({id, name}) => {
                    const Icon = layerIcons[id];
                    const isActive = activeLayer === id;
                    const isHovered = hoveredLayer === id;

                    return (
                        <button
                            key={id}
                            onClick={() => onLayerSelect(id)}
                            onMouseEnter={() => onLayerHover(id)}
                            onMouseLeave={() => onLayerHover(null)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 border-2 border-transparent ${
                                isActive ? 'bg-cyan-500/20 border-cyan-500 text-white' : 'hover:bg-gray-700/50 text-gray-300'
                            }`}
                        >
                            <Icon className={`w-6 h-6 transition-transform duration-300 ${isHovered || isActive ? 'scale-110' : ''}`} />
                            <span className="flex-grow text-sm">{name.split(': ')[1]}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
