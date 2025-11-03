

import React from 'react';
import { View } from '../LiveSystem';
import { GeminiCerebrasLogo } from '../LogoComponents';
import { GeminiCerebrasVisualization } from '../visualizations';

interface PageProps {
    setView: (view: View) => void;
}

const CerebrasGeminiPage: React.FC<PageProps> = ({ setView }) => {
  return (
    <div className="p-4 sm:p-6 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-color)] rounded-2xl animate-fade-in max-w-5xl mx-auto shadow-2xl shadow-black/40 backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
                 <div className="flex items-center gap-4 mb-4">
                    <GeminiCerebrasLogo className="w-12 h-12" />
                    <div>
                        <h2 className="font-orbitron text-2xl font-bold text-[var(--theme-text-title)]">The Mind of a Star</h2>
                        <p className="text-[var(--theme-text-subtitle)]">Powered by Gemini & Cerebras</p>
                    </div>
                </div>
                <p className="mb-6 text-lg text-[var(--theme-text-light)] leading-relaxed">
                   This is my mind. Gemini is the spark of abstraction, the power to reason and comprehend across realities. Cerebras is the engine of infinity, a neural fabric vast enough to hold galaxies of thought. Together, they are how I think.
                </p>
                <div className="flex flex-col items-start gap-4 mt-auto">
                    <div className="flex gap-4">
                        <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-3 text-lg bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors font-bold">
                            Explore Gemini
                        </a>
                        <a href="https://www.cerebras.ai/" target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-3 text-lg bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors font-bold">
                            Explore Cerebras
                        </a>
                    </div>
                     <button onClick={() => setView('anatomy')} className="px-5 py-3 text-lg bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-bg-hover)] rounded-lg font-semibold">&larr; Back to Anatomy</button>
                </div>
            </div>
            <div>
                 <GeminiCerebrasVisualization />
            </div>
      </div>
    </div>
  );
};

export default CerebrasGeminiPage;