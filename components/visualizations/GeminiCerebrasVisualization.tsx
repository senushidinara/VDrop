import React, { useState } from 'react';

const NeuralNode: React.FC<{ active: boolean, delay: number }> = ({ active, delay }) => (
    <div 
        className={`w-2 h-2 rounded-full bg-rose-900 transition-all duration-500 ${active ? 'bg-rose-400 scale-150' : ''}`}
        style={{ transitionDelay: `${delay}ms`}}
    />
);

export const GeminiCerebrasVisualization: React.FC = () => {
    const [isReasoning, setIsReasoning] = useState(false);
    const [result, setResult] = useState('');

    const startReasoning = () => {
        setIsReasoning(true);
        setResult('');
        setTimeout(() => {
            setResult("Prediction: A collaborative, multi-agent approach is optimal. Spawning specialized sub-agents for research, simulation, and creative synthesis.");
            setIsReasoning(false);
        }, 3000); // 3-second simulation
    };

    return (
        <div className="flex flex-col items-center h-full p-4 text-center">
            <h4 className="font-orbitron mb-2 text-rose-300">Cognitive & Neural Fabric</h4>
            <p className="mb-4 text-gray-400 text-sm">Input a complex challenge to witness the emergent reasoning process.</p>
            
            <div className="w-full max-w-md mb-4">
                <button onClick={startReasoning} disabled={isReasoning} className="w-full py-2 bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors disabled:opacity-50">
                    {isReasoning ? 'Reasoning...' : "Simulate: 'Design a sustainable city'"}
                </button>
            </div>

            <div className="flex-grow w-full flex flex-col items-center justify-center gap-4 p-4 bg-black/30 rounded-lg">
                <div className="w-full">
                    <p className="font-orbitron text-xs text-rose-200 mb-2">L1: Gemini (High-Level Reasoning)</p>
                    <div className="h-4 bg-gray-800 rounded-full flex items-center justify-center text-xs overflow-hidden">
                        <div className={`h-full bg-rose-500 rounded-full transition-all duration-3000 ease-linear ${isReasoning ? 'w-full' : 'w-0'}`} />
                    </div>
                </div>

                <div className="text-2xl text-rose-400 animate-pulse">&darr;</div>

                <div className="w-full">
                    <p className="font-orbitron text-xs text-rose-200 mb-2">L2: Cerebras (Parallel Neural Computation)</p>
                    <div className="grid grid-cols-10 gap-2 w-full max-w-xs mx-auto">
                        {Array.from({ length: 50 }).map((_, i) => (
                            <NeuralNode key={i} active={isReasoning} delay={i * 20} />
                        ))}
                    </div>
                </div>

                {result && (
                     <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-rose-500/50 text-rose-200 text-xs font-mono animate-fade-in">
                        <p className="font-bold mb-1">[VULTRA DROP RESPONSE]</p>
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
};
