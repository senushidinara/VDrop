import React, { useState, useEffect, useRef } from 'react';

interface Node {
    x: number;
    y: number;
    size: number;
    activation: number;
    layer: number;
}

const NeuralNode: React.FC<{ x: number; y: number; size: number; activation: number }> = ({ x, y, size, activation }) => {
    const color = `rgba(251, 113, 133, ${activation * 0.8 + 0.1})`;
    const glowColor = `rgba(251, 113, 133, ${activation * 0.5})`;
    return (
        <g transform={`translate(${x},${y})`}>
            <circle r={size * 2.5} fill={glowColor} style={{ transition: 'all 0.3s ease' }} />
            <circle r={size} fill={color} style={{ transition: 'all 0.3s ease' }} />
        </g>
    );
};

const NeuralConnection: React.FC<{ x1: number; y1: number; x2: number; y2: number; activation: number }> = ({ x1, y1, x2, y2, activation }) => (
    <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={`rgba(251, 113, 133, ${activation * 0.5 + 0.05})`}
        strokeWidth={1}
        style={{ transition: 'stroke 0.5s ease' }}
    />
);

export const GeminiCerebrasVisualization: React.FC = () => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        const setup = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            setDimensions({ width, height });

            const newNodes: Node[] = [];
            const layers = [5, 8, 12, 8, 5];
            
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
        };

        setup();
        const handleResize = () => setup();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (nodes.length === 0) return;

        intervalRef.current = window.setInterval(() => {
            const nodeToActivate = Math.floor(Math.random() * nodes.length);
            setNodes(currentNodes => currentNodes.map((n, idx) => {
                if (idx === nodeToActivate) {
                    return { ...n, activation: 1 };
                }
                return { ...n, activation: Math.max(0, n.activation - 0.05) };
            }));
        }, 100);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [nodes.length]);

    const connections: Array<{ x1: number; y1: number; x2: number; y2: number; activation: number }> = [];
    nodes.forEach((n1, i) => {
        nodes.forEach((n2, j) => {
            if (i < j && n2.layer === n1.layer + 1) {
                connections.push({
                    x1: n1.x,
                    y1: n1.y,
                    x2: n2.x,
                    y2: n2.y,
                    activation: (n1.activation + n2.activation) / 2,
                });
            }
        });
    });

    return (
        <svg className="w-full h-full" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
            <g>
                {connections.map((conn, i) => (
                    <NeuralConnection key={`conn-${i}`} {...conn} />
                ))}
            </g>
            <g>
                {nodes.map((node, i) => (
                    <NeuralNode key={`node-${i}`} {...node} />
                ))}
            </g>
        </svg>
    );
};
