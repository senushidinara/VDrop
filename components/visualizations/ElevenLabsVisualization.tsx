
import React, { useState, useEffect, useRef } from 'react';

const SoundWave: React.FC<{ energy: number, stability: number, time: number }> = ({ energy, stability, time }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, "#a855f7");
        gradient.addColorStop(0.5, "#ec4899");
        gradient.addColorStop(1, "#f97316");

        // Draw multiple waves
        for (let j = 1; j <= 3; j++) {
            ctx.beginPath();
            ctx.lineWidth = j === 1 ? 2.5 : 1.5;
            ctx.strokeStyle = gradient;
            ctx.globalAlpha = j === 1 ? 1 : 0.4;

            for (let i = 0; i < width; i++) {
                const frequency = (5 + (1 - stability) * 10) / (j * 1.5);
                const amplitude = (5 + energy * (height / 3)) / j;
                const phase = i / (100 / frequency);
                const noise = Math.sin(i * 0.01 * j + time * 0.002) * ( (1 - stability) * 10 );
                const y = centerY + Math.sin(phase + time * 0.005 * j) * amplitude + noise;

                if (i === 0) {
                    ctx.moveTo(i, y);
                } else {
                    ctx.lineTo(i, y);
                }
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

    }, [energy, stability, time]);

    return <canvas ref={canvasRef} className="w-full h-32" />;
};


export const ElevenLabsVisualization: React.FC = () => {
    const [stability, setStability] = useState(0.5);
    const [energy, setEnergy] = useState(0.75);
    const [time, setTime] = useState(0);

    useEffect(() => {
        let animationFrameId: number;
        const animate = (timestamp: number) => {
            setTime(timestamp);
            animationFrameId = requestAnimationFrame(animate);
        }
        animate(0);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-[350px] p-4 text-sm text-center">
            
            <SoundWave energy={energy} stability={stability} time={time} />

            <div className="w-full max-w-sm space-y-4 mt-8">
                <div>
                    <label htmlFor="stability" className="flex justify-between mb-1 text-sm"><span>Stability</span> <span>(Calm &harr; Expressive)</span></label>
                    <input id="stability" type="range" min="0.1" max="0.9" step="0.05" value={stability} onChange={(e) => setStability(parseFloat(e.target.value))} className="w-full accent-purple-500" />
                </div>
                <div>
                    <label htmlFor="energy" className="flex justify-between mb-1 text-sm"><span>Energy</span> <span>(Monotone &harr; Dynamic)</span></label>
                    <input id="energy" type="range" min="0.1" max="1.0" step="0.05" value={energy} onChange={(e) => setEnergy(parseFloat(e.target.value))} className="w-full accent-pink-500" />
                </div>
            </div>

        </div>
    );
};