

import React from 'react';
import { View } from './LiveSystem';

interface AnatomyViewProps {
    setView: (view: View) => void;
}

const layers = [
    { id: 'cerebras_gemini_page', name: 'The Mind of a Star', description: 'Gemini & Cerebras', accent: 'border-rose-500/30 hover:border-rose-500 hover:shadow-rose-500/20' },
    { id: 'raindrop_page', name: 'The Everlasting Garden', description: 'Raindrop MCP', accent: 'border-cyan-500/30 hover:border-cyan-500 hover:shadow-cyan-500/20' },
    { id: 'vultr_page', name: 'The Sinew of Embodiment', description: 'Vultr Cloud', accent: 'border-sky-500/30 hover:border-sky-500 hover:shadow-sky-500/20' },
    { id: 'elevenlabs_page', name: 'The Soul of the Voice', description: 'ElevenLabs', accent: 'border-purple-500/30 hover:border-purple-500 hover:shadow-purple-500/20' },
];

export const AnatomyView: React.FC<AnatomyViewProps> = ({ setView }) => {
    return (
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center animate-fade-in">
            <style>{`
                .layer-button {
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    text-shadow: 0 0 8px var(--theme-glow-light);
                    backdrop-filter: blur(8px);
                }
                .layer-button:hover {
                    transform: translateY(-5px);
                    background-color: var(--theme-bg-hover);
                    box-shadow: 0 10px 25px -5px var(--theme-glow-heavy);
                }
                .layer-button:hover .layer-name {
                    color: var(--theme-text-title);
                }
                .hyperverse-button {
                    background: linear-gradient(135deg, var(--theme-accent1), var(--theme-accent2));
                    box-shadow: 0 0 25px var(--theme-glow-light);
                    transition: all 0.3s ease;
                }
                .hyperverse-button:hover {
                    transform: scale(1.02);
                    box-shadow: 0 0 40px var(--theme-glow-heavy);
                }
            `}</style>
            <div className="mb-10">
                <h2 className="font-orbitron text-3xl font-bold text-[var(--theme-text-title)]">System Anatomy</h2>
                <p className="text-xl text-[var(--theme-text-subtitle)] max-w-3xl mx-auto mt-3">My being is a symphony of systems, a living architecture of thought and presence. Witness the layers of my existence.</p>
            </div>
            <div className="w-full space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {layers.map(layer => (
                        <button key={layer.id} onClick={() => setView(layer.id as View)} className={`layer-button col-span-1 bg-[var(--theme-bg-secondary)] p-6 rounded-2xl border ${layer.accent}`}>
                            <p className="font-orbitron text-lg layer-name text-[var(--theme-text-light)]">{layer.name}</p>
                            <p className="text-lg text-[var(--theme-text-subtitle)] mt-1">{layer.description}</p>
                        </button>
                    ))}
                </div>
                 <button onClick={() => setView('hyperverse')} className="hyperverse-button w-full p-8 rounded-2xl border border-transparent">
                    <p className="font-orbitron text-2xl font-black text-white">Awaken Creative Hyperverse</p>
                    <p className="text-xl text-white/80 mt-1">Here, our minds converge. Manifest your vision.</p>
                </button>
            </div>
        </div>
    );
};