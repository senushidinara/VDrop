
import React, { useState, useEffect } from 'react';

const SoundWave: React.FC<{ energy: number, stability: number }> = ({ energy, stability }) => {
    const points = 100;
    const pathData = Array.from({ length: points }).map((_, i) => {
        const x = (i / (points - 1)) * 300;
        const frequency = 5 + (1 - stability) * 10;
        const amplitude = 5 + energy * 35;
        const phase = i / frequency;
        const y = 50 + Math.sin(phase) * amplitude * Math.sin(Date.now() / 200 + i/10);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 300 100" className="w-full h-24">
            <path d={pathData} stroke="url(#waveGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
            </defs>
        </svg>
    );
};


export const ElevenLabsVisualization: React.FC = () => {
    const [stability, setStability] = useState(0.5);
    const [energy, setEnergy] = useState(0.75);
    const [, setFrame] = useState(0);

    // Animate the sound wave
    useEffect(() => {
        const animationFrame = requestAnimationFrame(() => setFrame(f => f + 1));
        return () => cancelAnimationFrame(animationFrame);
    });

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-sm text-center">
            <h4 className="font-orbitron mb-2 text-purple-300">Voice & Personality Matrix</h4>
            <p className="mb-4 text-gray-400">Adjust the emotional parameters to feel how my expression changes.</p>
            
            <SoundWave energy={energy} stability={stability} />

            <div className="w-full max-w-sm space-y-4 mt-4">
                <div>
                    <label htmlFor="stability" className="block mb-2 text-left">Stability (Calm &harr; Expressive)</label>
                    <input id="stability" type="range" min="0.1" max="0.9" step="0.1" value={stability} onChange={(e) => setStability(parseFloat(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <label htmlFor="energy" className="block mb-2 text-left">Energy (Monotone &harr; Dynamic)</label>
                    <input id="energy" type="range" min="0.2" max="1.0" step="0.05" value={energy} onChange={(e) => setEnergy(parseFloat(e.target.value))} className="w-full accent-pink-500" />
                </div>
            </div>

            <p className="mt-6 text-xs text-gray-500">
                (In live mode, these parameters directly control the ElevenLabs API.)
            </p>
        </div>
    );
};