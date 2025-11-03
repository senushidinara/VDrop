
import React from 'react';

interface Layer {
    id: string;
    name: string;
    description: string;
}

interface LayerDetailViewProps {
    layer: Layer;
}

export const LayerDetailView: React.FC<LayerDetailViewProps> = ({ layer }) => {
    return (
        <div className="bg-black/20 p-4 rounded-2xl border border-cyan-500/10 shadow-lg animate-fade-in">
             <h4 className="font-orbitron text-md mb-2 text-cyan-200">{layer.name}</h4>
             <p className="text-sm text-gray-400 font-light">{layer.description}</p>
        </div>
    );
};
