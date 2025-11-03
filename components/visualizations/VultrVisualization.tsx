import React, { useState } from 'react';

// A simplified world map path
const WorldMap = () => (
    <svg viewBox="0 0 1000 500" className="w-full h-full">
        <path d="M499.999 499.818C223.859 499.818 0 387.89 0 249.909S223.859-.001 499.999-.001s500 111.928 500 249.91c0 137.981-223.86 249.91-500.001 249.91zM236.007 137.747l-15.021-15.188-4.965 24.811-20.015-20.243-15.093 15.01-8.303-20.732-20.709 8.326-15.01-15.094-20.244 20.015-24.811-4.965-15.188 15.021 10.01 22.396-10.01 22.396 15.188 15.021 24.811 4.965-20.244 20.243 15.01 15.094 20.709-8.326 8.303 20.732 15.093-15.01 20.015 20.244 4.965-24.811 15.021 15.188-22.396-10.01 22.396 10.01 15.021-15.188 4.965-24.811 20.244-20.243 15.093-15.01 8.303 20.732 20.709-8.326 15.01 15.094 20.243-20.015 24.811 4.965 15.188-15.021-10.01-22.396 10.01-22.396-15.188-15.021-24.811-4.965 20.243-20.244-15.01-15.093-20.709 8.326-8.303-20.732-15.094 15.01-20.015-20.243-4.965 24.811-15.021-15.188 22.396 10.01-22.396-10.01zM448.332 249.909c0 10.352-8.396 18.748-18.748 18.748s-18.748-8.396-18.748-18.748 8.396-18.748 18.748-18.748 18.748 8.396 18.748 18.748zM572.261 249.909c0 10.352-8.396 18.748-18.748 18.748s-18.748-8.396-18.748-18.748 8.396-18.748 18.748-18.748 18.748 8.396 18.748 18.748zM824.162 312.448l15.021 15.188 4.965-24.811 20.015 20.243 15.094-15.01 8.303 20.732 20.709-8.326 15.01 15.094 20.244-20.015 24.811 4.965 15.188-15.021-10.01-22.396 10.01-22.396-15.188-15.021-24.811-4.965 20.244-20.243-15.01-15.094-20.709 8.326-8.303-20.732-15.094 15.01-20.015 20.243 4.965-24.811 15.021-15.188 22.396-10.01 22.396 10.01 15.021 15.188 4.965 24.811-20.244 20.243-15.094 15.01-8.303-20.732-20.709 8.326-15.01-15.094-20.243 20.015-24.811-4.965-15.188 15.021 10.01 22.396-10.01 22.396 15.188 15.021 24.811 4.965-20.243 20.244 15.01 15.093 20.709-8.326 8.303 20.732 15.094-15.01 20.015 20.243 4.965-24.811 15.188 15.021-22.396 10.01 22.396-10.01z" fill="#000" opacity="0.2" />
        <path d="M968.6 250.9c0-129.2-209.7-234-468.6-234-258.8 0-468.6 104.8-468.6 234 0 129.2 209.7 234 468.6 234 258.8 0 468.6-104.8 468.6-234zM133.5 130.6c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8c-.1-4.4-3.6-8-8-8zm-16 24c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-16 32c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm24-40c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-8 40c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-24 16c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm8-16c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-8-24c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM825 352.9c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-8 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-8 16c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm12-20c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-4 20c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm4-8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm-4-12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" fill="#111827" />
    </svg>
);

const Node: React.FC<{ x: number, y: number, isDragging: boolean, onMouseDown: (e: React.MouseEvent) => void }> = ({ x, y, isDragging, onMouseDown }) => (
    <g transform={`translate(${x}, ${y})`} onMouseDown={onMouseDown} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
        <circle r="15" fill="rgb(14 165 233)" stroke="#fff" strokeWidth="2" className="opacity-80"/>
        <circle r="25" fill="none" stroke="rgb(14 165 233)" strokeWidth="1" className="animate-ping" />
    </g>
);

export const VultrVisualization: React.FC = () => {
    const [nodes, setNodes] = useState([{ x: 200, y: 250 }, { x: 800, y: 250 }]);
    const [draggingNode, setDraggingNode] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingNode === null) return;
        const svg = e.currentTarget.closest('svg');
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const { x, y } = pt.matrixTransform(svg.getScreenCTM()?.inverse());
        
        setNodes(prev => prev.map((node, i) => i === draggingNode ? { x, y } : node));
    };

    const handleMouseUp = () => {
        setDraggingNode(null);
    };

    return (
        <div className="relative h-[350px] overflow-hidden rounded-lg">
            <div className="absolute inset-0">
                <WorldMap />
            </div>
            <svg className="absolute inset-0 w-full h-full" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                {nodes.map((node, i) => (
                    <Node key={i} {...node} isDragging={draggingNode === i} onMouseDown={() => setDraggingNode(i)} />
                ))}
                {nodes.length > 1 && (
                     <path d={`M ${nodes[0].x} ${nodes[0].y} Q ${(nodes[0].x + nodes[1].x)/2} ${(nodes[0].y + nodes[1].y)/2 - 100} ${nodes[1].x} ${nodes[1].y}`}
                     stroke="url(#coreGradient)" fill="none" strokeWidth="2" strokeDasharray="5" className="animate-pulse" />
                )}
            </svg>
            <div className="absolute bottom-2 left-2 p-2 bg-black/50 rounded text-xs text-sky-300 font-orbitron">
                Drag nodes to move consciousness across the global compute layer.
            </div>
        </div>
    );
};
