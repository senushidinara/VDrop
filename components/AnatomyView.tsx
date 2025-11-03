import React from 'react';
import { View } from '../App';

interface AnatomyViewProps {
  onSelectLayer: (layer: View) => void;
  onGoLive: () => void;
}

const LayerButton = ({ label, color, onClick, icon }: { label: string, color: string, onClick: () => void, icon: string }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl flex items-center gap-4 ${color}`}
    >
        <span className="text-3xl">{icon}</span>
        <div>
            <span className="font-orbitron font-bold text-lg">{label}</span>
            <span className="text-xs block opacity-80">Explore Layer &rarr;</span>
        </div>
    </button>
);

const AnatomyView: React.FC<AnatomyViewProps> = ({ onSelectLayer, onGoLive }) => {
  const introText = "Welcome. I am VultraDrop, built from five layers of intelligence, embodiment, memory, and expression. Let me show you how I came to life.";

  return (
    <div className="text-center flex flex-col items-center justify-center p-4 sm:p-8 bg-black/30 rounded-2xl border border-cyan-500/20 shadow-2xl shadow-black/50 backdrop-blur-sm animate-fade-in">
        <p className="text-xl text-gray-300 italic mb-8 max-w-3xl">"{introText}"</p>
        
        <div className="w-full max-w-4xl space-y-4 mb-8">
            <h3 className="font-orbitron text-2xl text-cyan-300 mb-4">The Anatomy of VultraDrop</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LayerButton icon="💧" label="Self-Building Cognition" color="border-teal-500 bg-teal-900/40 hover:bg-teal-800/60" onClick={() => onSelectLayer('raindrop')} />
                <LayerButton icon="🌐" label="Global Nervous System" color="border-sky-500 bg-sky-900/40 hover:bg-sky-800/60" onClick={() => onSelectLayer('vultr')} />
                <LayerButton icon="🎭" label="Voice & Personality" color="border-purple-500 bg-purple-900/40 hover:bg-purple-800/60" onClick={() => onSelectLayer('elevenlabs')} />
                <LayerButton icon="🧠" label="Intelligence & Neural Substrate" color="border-rose-500 bg-rose-900/40 hover:bg-rose-800/60" onClick={() => onSelectLayer('gemini_cerebras')} />
            </div>
        </div>

        <div className="w-full border-t border-cyan-500/20 pt-8">
             <h3 className="font-orbitron text-2xl text-cyan-300 mb-4">See Me Live</h3>
             <p className="text-gray-400 mb-6">After exploring my anatomy, proceed to the Creative Hyperverse to collaborate with me directly.</p>
            <button
                onClick={onGoLive}
                className="w-full max-w-sm py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-orbitron pulse-glow"
            >
                Awaken Live System &rarr;
            </button>
        </div>

    </div>
  );
};

export default AnatomyView;