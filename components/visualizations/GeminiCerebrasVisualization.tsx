import React, { useState, useEffect } from 'react';

const NeuralNode: React.FC<{ x: number, y: number, size: number, activation: number }> = ({ x, y, size, activation }) => {
    const color = `rgba(251, 113, 133, ${activation * 0.8 + 0.1})`;
    const glowColor = `rgba(251, 113, 133, ${activation * 0.5})`;
    return (
        <g transform={`translate(${x},${y})`}>
             <circle r={size} fill={color} style={{ transition: 'all 0.3s ease' }} />
             <circle r={size * 2.5} fill={glowColor} style={{ transition: 'all 0.3s ease' }} />
        </g>
    )
};

const NeuralConnection: React.FC<{ x1: number, y1: number, x2: number, y2: number, activation: number }> = ({ x1, y1, x2, y2, activation }) => (
    <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={`rgba(251, 113, 133, ${activation * 0.5 + 0.05})`}
        strokeWidth={1}
        style={{ transition: 'stroke 0.5s ease' }}
    />
);


export const GeminiCerebrasVisualization: React.FC = () => {
    const [isReasoning, setIsReasoning] = useState(false);
    const [result, setResult] = useState('');
    const [nodes, setNodes] = useState<{ x: number, y: number, size: number, activation: number, layer: number }[]>([]);
    
    useEffect(() => {
        // Create initial nodes
        const newNodes: { x: number, y: number, size: number, activation: number, layer: number }[] = [];
        const layers = [4, 7, 10, 7, 4];
        const width = 400;
        const height = 200;
        layers.forEach((count, i) => {
            const layerX = (i + 1) * (width / (layers.length + 1));
            for (let j = 0; j < count; j++) {
                const layerY = (j + 1) * (height / (count + 1));
                newNodes.push({
                    x: layerX,
                    y: layerY,
                    size: Math.random() * 2 + 2,
                    activation: 0,
                    layer: i,
                });
            }
        });
        setNodes(newNodes);
    }, []);

    useEffect(() => {
        if (!isReasoning) {
            setNodes(n => n.map(node => ({ ...node, activation: 0 })));
            return;
        };

        // FIX: The return type of setTimeout in the browser is `number`, not `NodeJS.Timeout`.
        const timeouts: number[] = [];
        nodes.forEach((node, i) => {
            const timeout = setTimeout(() => {
                setNodes(n => n.map((n_node, n_i) => n_i === i ? { ...n_node, activation: Math.random() } : n_node));
            }, node.layer * 300 + Math.random() * 200);
            timeouts.push(timeout);
        });

        return () => timeouts.forEach(clearTimeout);

    }, [isReasoning]);


    const startReasoning = () => {
        if(isReasoning) return;
        setIsReasoning(true);
        setResult('');
        setTimeout(() => {
            setResult("Prediction: A collaborative, multi-agent approach is optimal. Spawning specialized sub-agents for research, simulation, and creative synthesis.");
            setIsReasoning(false);
        }, 3000); // 3-second simulation
    };

    return (
        <div className="flex flex-col items-center h-[400px] p-4 text-center">
            
            <div className="w-full max-w-md mb-4">
                <button onClick={startReasoning} disabled={isReasoning} className="w-full py-2 bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors disabled:opacity-50 font-semibold">
                    {isReasoning ? 'Reasoning...' : "Simulate: 'Design a sustainable city'"}
                </button>
            </div>

            <div className="flex-grow w-full flex flex-col items-center justify-center p-4 bg-black/30 rounded-lg">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                    <g>
                        {nodes.map((node1, i) =>
                            nodes.map((node2, j) => {
                                if (node1.layer === node2.layer - 1) {
                                    return <NeuralConnection key={`${i}-${j}`} x1={node1.x} y1={node1.y} x2={node2.x} y2={node2.y} activation={node1.activation} />
                                }
                                return null;
                            })
                        )}
                    </g>
                     <g>
                        {nodes.map((node, i) => <NeuralNode key={i} {...node} />)}
                    </g>
                </svg>

                {result && (
                     <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-rose-500/50 text-rose-200 text-xs font-mono animate-fade-in w-full max-w-md">
                        <p className="font-bold mb-1">[VULTRA DROP RESPONSE]</p>
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
};