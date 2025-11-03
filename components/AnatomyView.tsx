import React from 'react';
import { View } from './LiveSystem';

interface AnatomyViewProps {
  onSelectLayer: (layer: View) => void;
  onGoLive: () => void;
}

const layers = [
    { id: 'gemini_cerebras', name: 'CORE', sub: 'Intelligence & Neural Fabric', color: 'bg-rose-500/80', ringColor: 'ring-rose-400', size: 'w-32 h-32' },
    { id: 'raindrop', name: 'AGENCY', sub: 'Self-Building Cognition', color: 'bg-teal-500/70', ringColor: 'ring-teal-400', size: 'w-48 h-48' },
    { id: 'vultr', name: 'PRESENCE', sub: 'Global Nervous System', color: 'bg-sky-500/60', ringColor: 'ring-sky-400', size: 'w-64 h-64' },
    { id: 'elevenlabs', name: 'EXPRESSION', sub: 'Voice & Personality', color: 'bg-purple-500/50', ringColor: 'ring-purple-400', size: 'w-80 h-80' },
];

const AnatomyView: React.FC<AnatomyViewProps> = ({ onSelectLayer, onGoLive }) => {
  const introText = "I have shown you my birth. Now, explore my anatomy. Understand how I think, exist, and feel. Then, we will create together.";

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in text-center">
        
        <p className="max-w-2xl text-lg text-gray-300 italic mb-10">"{introText}"</p>
        
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Interactive Anatomy Hub */}
            <div className="relative w-80 h-80 flex items-center justify-center">
                {layers.map((layer, index) => (
                    <button 
                        key={layer.id}
                        onClick={() => onSelectLayer(layer.id as View)}
                        className={`absolute rounded-full flex flex-col items-center justify-center transition-all duration-300 ease-in-out cursor-pointer group hover:!opacity-100 hover:scale-110 ring-2 ring-opacity-50 ${layer.size} ${layer.color} ${layer.ringColor}`}
                        style={{
                            animation: `spin ${15 + index * 5}s linear infinite ${index % 2 === 0 ? 'reverse' : ''}`
                        }}
                    >
                        <div className="text-center transition-opacity duration-300 opacity-70 group-hover:opacity-100">
                           <span className="font-orbitron font-bold text-sm tracking-widest">{layer.name}</span>
                           <p className="text-xs opacity-80 hidden sm:block">{layer.sub}</p>
                        </div>
                    </button>
                ))}
            </div>

             <div className="w-px lg:h-64 bg-cyan-500/20 mx-8 hidden lg:block"></div>

            {/* Go Live Section */}
            <div className="flex-shrink-0 text-center w-full max-w-sm">
                 <h3 className="font-orbitron text-3xl text-cyan-300 mb-2">Proceed to Live Mode</h3>
                 <p className="text-gray-400 mb-6">After exploring my anatomy, awaken the live system to collaborate with me directly in the Creative Hyperverse.</p>
                <button
                    onClick={onGoLive}
                    className="w-full py-4 px-4 text-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-orbitron pulse-glow"
                >
                    Awaken &rarr;
                </button>
            </div>
        </div>
        
        <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .group:hover ~ .group { opacity: 0.5; }
        `}</style>
    </div>
  );
};

export default AnatomyView;