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
    const [nodes, setNodes] = useState<{ x: number, y: number, size: number, activation: number, layer: number }[]>([]);
    
    useEffect(() => {
        const setup = () => {
            const newNodes: { x: number, y: number, size: number, activation: number, layer: number }[] = [];
            const layers = [5, 8, 12, 8, 5];
            const width = window.innerWidth;
            const height = window.innerHeight;
            layers.forEach((count, i) => {
                const layerX = (i + 1) * (width / (layers.length + 1));
                for (let j = 0; j < count; j++) {
                    const layerY = (j + 1) * (height / (count + 1));
                    newNodes.push({
                        x: layerX + (Math.random() - 0.5) * 50,
                        y: layerY + (Math.random() - 0.5) * 50,
                        size: Math.random() * 2 + 2,
                        activation: 0,
                        layer: i,
                    });
                }
            });
            setNodes(newNodes);
        }
        setup();
        window.addEventListener('resize', setup);
        return () => window.removeEventListener('resize', setup);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const nodeToActivate = Math.floor(Math.random() * nodes.length);
            setNodes(currentNodes => currentNodes.map((n, idx) => {
                if (idx === nodeToActivate) {
                    return { ...n, activation: 1 };
                }
                // Decay activation
                return { ...n, activation: Math.max(0, n.activation - 0.05) };
            }));
        }, 100);

        return () => clearInterval(interval);
    }, [nodes.length]);

    return (
        <div className="w-full h-full">
            <svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`} className="w-full h-full">
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
        </div>
    );
};