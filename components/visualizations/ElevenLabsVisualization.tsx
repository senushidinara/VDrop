
import React, { useState, useEffect, useRef } from 'react';

export const ElevenLabsVisualization: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        setup();
        
        const animate = (time: number) => {
            const width = canvas.width;
            const height = canvas.height;
            const centerY = height / 2;

            ctx.clearRect(0, 0, width, height);

            const gradient = ctx.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop(0, "var(--theme-accent2)");
            gradient.addColorStop(0.5, "#ec4899");
            gradient.addColorStop(1, "var(--theme-accent1)");

            const stability = 0.5 + Math.sin(time * 0.0001) * 0.4;
            const energy = 0.6 + Math.cos(time * 0.0002) * 0.4;


            // Draw multiple waves
            for (let j = 1; j <= 5; j++) {
                ctx.beginPath();
                ctx.lineWidth = j === 1 ? 2.5 : 1.5;
                ctx.strokeStyle = gradient;
                ctx.globalAlpha = j === 1 ? 1 : 0.3;

                for (let i = 0; i < width; i++) {
                    const frequency = (5 + (1 - stability) * 10) / (j * 1.5);
                    const amplitude = (10 + energy * (height / 4)) / j;
                    const phase = i / (200 / frequency);
                    const noise = Math.sin(i * 0.005 * j + time * 0.001) * ( (1 - stability) * 20 );
                    const y = centerY + Math.sin(phase + time * 0.002 * j) * amplitude + noise;

                    if (i === 0) {
                        ctx.moveTo(i, y);
                    } else {
                        ctx.lineTo(i, y);
                    }
                }
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            animationFrameId = requestAnimationFrame(animate);
        };

        animate(0);
        window.addEventListener('resize', setup);

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', setup);
        };
    }, []);

    return (
        <div className="w-full h-full">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};