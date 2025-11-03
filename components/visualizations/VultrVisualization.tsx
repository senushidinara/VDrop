import React, { useState, useEffect } from 'react';

// Simplified world map coordinates (reduced for performance)
const worldMapCoordinates = [[170,222],[183,213],[197,210],[212,203],[224,196],[238,198],[252,196],[267,192],[281,191],[295,188],[308,183],[321,179],[337,182],[346,186],[356,193],[354,207],[349,219],[341,228],[328,226],[315,227],[310,235],[319,245],[328,248],[331,256],[329,266],[321,271],[312,274],[310,283],[318,289],[326,292],[337,295],[345,299],[354,296],[361,293],[363,284],[356,278],[348,281],[342,273],[349,267],[356,260],[353,252],[360,249],[368,252],[371,244],[378,237],[385,240],[388,249],[390,257],[383,263],[375,266],[372,275],[379,279],[387,282],[390,290],[383,296],[375,293],[368,291],[365,299],[372,305],[380,302],[387,305],[395,308],[403,311],[411,308],[419,305],[427,302],[435,299],[443,296],[451,293],[459,290],[467,287],[475,284],[483,281],[491,278],[499,275],[507,272],[515,269],[523,266],[531,263],[539,260],[547,257],[555,254],[563,251],[571,248],[579,245],[587,242],[595,239],[603,236]];

const Node: React.FC<{ x: number; y: number }> = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
        <circle r="8" fill="rgb(14 165 233)" stroke="#fff" strokeWidth="1" className="opacity-80 drop-shadow-[0_0_8px_rgba(125,211,252,0.8)]"/>
        <circle r="15" fill="none" stroke="rgb(14 165 233)" strokeWidth="1" className="animate-ping" style={{ transformOrigin: 'center', transformBox: 'fill-box', animationDuration: '3s' }} />
    </g>
);

export const VultrVisualization: React.FC = () => {
    const [nodes] = useState([
        { x: 250, y: 200 }, 
        { x: 750, y: 250 }, 
        { x: 500, y: 400 }, 
        { x: 150, y: 350 }, 
        { x: 850, y: 150 }
    ]);

    const pathD = `M ${nodes[0].x} ${nodes[0].y} Q 500 100 ${nodes[1].x} ${nodes[1].y} T ${nodes[2].x} ${nodes[2].y} T ${nodes[3].x} ${nodes[3].y} T ${nodes[4].x} ${nodes[4].y}`;

    return (
        <div className="w-full h-full relative">
            <style>{`
                .particle {
                    animation: pulse 4s infinite alternate;
                }
                @keyframes pulse {
                    from { opacity: 0.4; transform: scale(0.9); }
                    to { opacity: 1.0; transform: scale(1.1); }
                }
            `}</style>
            <svg className="w-full h-full" viewBox="0 0 1000 500">
                <defs>
                    <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--theme-accent1)" />
                        <stop offset="100%" stopColor="var(--theme-accent2)" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* World Map */}
                <g transform="translate(100, 50) scale(0.8)">
                    {worldMapCoordinates.map(([x, y], i) => (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r={1.2}
                            fill="#0ea5e9"
                            className="particle"
                            style={{ animationDelay: `${(i % 100) * 40}ms` }}
                        />
                    ))}
                </g>

                {/* Connection Path */}
                <path 
                    d={pathD}
                    stroke="url(#coreGradient)" 
                    fill="none" 
                    strokeWidth="2" 
                    strokeDasharray="5" 
                />
                
                {/* Animated Packets */}
                <g filter="url(#glow)">
                    <circle r="4.5" fill="white">
                        <animateMotion id="packetMotion" dur="8s" repeatCount="indefinite" path={pathD} />
                    </circle>
                    <circle r="3" fill="white" fillOpacity="0.5">
                        <animateMotion dur="8s" repeatCount="indefinite" begin="packetMotion.begin+0.08s" path={pathD} />
                    </circle>
                    <circle r="2" fill="white" fillOpacity="0.3">
                        <animateMotion dur="8s" repeatCount="indefinite" begin="packetMotion.begin+0.16s" path={pathD} />
                    </circle>
                    <circle r="1" fill="white" fillOpacity="0.1">
                        <animateMotion dur="8s" repeatCount="indefinite" begin="packetMotion.begin+0.24s" path={pathD} />
                    </circle>
                </g>

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <Node key={i} {...node} />
                ))}
            </svg>
        </div>
    );
};
