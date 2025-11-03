import React from 'react';

interface LayerDetailViewProps {
  title: string;
  voiceover: string;
  onBack: () => void;
  children: React.ReactNode;
}

const LayerDetailView: React.FC<LayerDetailViewProps> = ({ title, voiceover, onBack, children }) => {
    return (
        <div className="bg-black/30 p-4 sm:p-6 rounded-2xl border border-cyan-500/20 shadow-2xl shadow-black/50 backdrop-blur-sm animate-fade-in">
            <div className="flex justify-between items-center border-b border-cyan-500/20 pb-4 mb-6">
                <button onClick={onBack} className="text-cyan-300 hover:text-cyan-100 transition-colors font-semibold">&larr; Back to Anatomy</button>
                <h2 className="font-orbitron text-xl md:text-2xl text-cyan-300 text-right">{title}</h2>
            </div>

            <div className="mb-6 p-4 bg-gray-900/60 rounded-lg border border-gray-700">
                <p className="text-gray-300 italic text-center text-sm sm:text-base">“{voiceover}”</p>
            </div>

            <div className="min-h-[350px] bg-black/20 p-4 rounded-lg border border-gray-700">
                {children}
            </div>
        </div>
    );
};

export default LayerDetailView;