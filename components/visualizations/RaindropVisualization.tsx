import React, { useState } from 'react';

interface Agent {
  id: number;
  name: string;
  dna: string[];
}

export const RaindropVisualization: React.FC = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    const spawnAgent = () => {
        const newId = agents.length;
        const newAgent: Agent = {
            id: newId,
            name: `Agent-${Math.random().toString(36).substring(2, 7)}`,
            dna: [
                'Memory Node: Inception',
                'Skill: Semantic Resonance',
                'Goal: Evolve',
                `Personality Trait: ${['Curious', 'Logical', 'Creative'][newId % 3]}`
            ]
        };
        setAgents(prev => [...prev, newAgent]);
        setSelectedAgent(newAgent);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full text-sm">
            <div className="flex-1 p-4 bg-black/30 rounded-lg">
                <h4 className="font-orbitron text-center mb-4 text-teal-300">Agent Garden</h4>
                <div className="flex flex-col items-center gap-4">
                    <button onClick={spawnAgent} className="w-full py-2 bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors">Spawn New Agent</button>
                    <div className="w-full h-48 overflow-y-auto space-y-2 p-2 bg-gray-900 rounded">
                        {agents.map(agent => (
                            <button key={agent.id} onClick={() => setSelectedAgent(agent)} className={`w-full text-left p-2 rounded transition-colors ${selectedAgent?.id === agent.id ? 'bg-teal-500' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                {agent.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4 bg-black/30 rounded-lg">
                <h4 className="font-orbitron text-center mb-4 text-teal-300">Agent DNA Inspector</h4>
                {selectedAgent ? (
                    <div className="font-mono text-xs space-y-2 text-teal-200">
                        <p><span className="font-bold text-white">Inspecting:</span> {selectedAgent.name}</p>
                        <ul className="list-disc list-inside bg-gray-900 p-2 rounded">
                            {selectedAgent.dna.map((trait, i) => <li key={i}>{trait}</li>)}
                        </ul>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">Select an agent or spawn a new one.</p>
                )}
            </div>
        </div>
    );
};
