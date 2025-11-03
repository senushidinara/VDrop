import React, { useState, useEffect, useRef } from 'react';

interface Agent {
  id: number;
  name: string;
  dna: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const RaindropVisualization: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    const spawnAgent = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const newId = agents.length;
        const newAgent: Agent = {
            id: newId,
            name: `Agent-${Math.random().toString(36).substring(2, 7)}`,
            dna: [
                'Memory Node: Inception',
                'Skill: Semantic Resonance',
                'Goal: Evolve',
                `Trait: ${['Curious', 'Logical', 'Creative'][newId % 3]}`
            ],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 4 + 8,
        };
        setAgents(prev => [...prev, newAgent]);
        setSelectedAgent(newAgent);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            agents.forEach(agent => {
                agent.x += agent.vx;
                agent.y += agent.vy;

                if (agent.x < agent.radius || agent.x > canvas.width - agent.radius) agent.vx *= -1;
                if (agent.y < agent.radius || agent.y > canvas.height - agent.radius) agent.vy *= -1;
                
                const isSelected = selectedAgent?.id === agent.id;
                
                const gradient = ctx.createRadialGradient(agent.x, agent.y, 0, agent.x, agent.y, agent.radius);
                gradient.addColorStop(0, isSelected ? 'rgba(165, 243, 252, 1)' : 'rgba(103, 232, 249, 0.8)');
                gradient.addColorStop(0.5, isSelected ? 'rgba(6, 182, 212, 0.7)' : 'rgba(15, 118, 128, 0.5)');
                gradient.addColorStop(1, 'rgba(15, 118, 128, 0)');
                
                ctx.beginPath();
                ctx.arc(agent.x, agent.y, agent.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(agent.x, agent.y, agent.radius + 4, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(165, 243, 252, 0.5)';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            });
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [agents, selectedAgent]);


    return (
        <div className="flex flex-col md:flex-row gap-4 h-[350px] text-sm">
            <div className="md:w-1/3 p-4 bg-black/30 rounded-lg flex flex-col">
                <h4 className="font-orbitron text-center mb-4 text-cyan-300">Agent Controller</h4>
                <div className="flex flex-col gap-4">
                    <button onClick={spawnAgent} className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors font-semibold">
                        Spawn New Agent
                    </button>
                    {selectedAgent ? (
                         <div className="font-mono text-xs space-y-2 text-cyan-100 bg-gray-900/50 p-3 rounded-lg flex-grow animate-fade-in">
                            <p><span className="font-bold text-white">Inspecting:</span> {selectedAgent.name}</p>
                            <ul className="list-disc list-inside space-y-1">
                                {selectedAgent.dna.map((trait, i) => <li key={i}>{trait}</li>)}
                            </ul>
                        </div>
                    ) : (
                         <div className="flex-grow flex items-center justify-center text-center text-gray-500">
                             <p>Spawn an agent to inspect its DNA.</p>
                         </div>
                    )}
                </div>
            </div>
            <div className="flex-1 rounded-lg relative overflow-hidden bg-black/30">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
                <div className="absolute top-2 left-2 p-2 bg-black/50 rounded text-xs text-cyan-300 font-orbitron">
                    Agent Garden ({agents.length} active)
                </div>
            </div>
        </div>
    );
};