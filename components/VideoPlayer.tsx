import React, { useState, useEffect, useRef } from 'react';
import { DownloadIcon } from './IconComponents';
import { Clip } from '../types';

const GeneratingAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;
        const particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
        const particleCount = 200;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                life: Math.random() * 100
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            const centerX = width / 2;
            const centerY = height / 2;

            particles.forEach(p => {
                const dx = centerX - p.x;
                const dy = centerY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                p.vx += dx / dist * 0.05;
                p.vy += dy / dist * 0.05;
                p.vx *= 0.98;
                p.vy *= 0.98;

                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.5;

                if (p.life <= 0) {
                    p.x = Math.random() * width;
                    p.y = Math.random() * height;
                    p.vx = (Math.random() - 0.5);
                    p.vy = (Math.random() - 0.5);
                    p.life = Math.random() * 100;
                }

                const alpha = p.life / 100;
                ctx.fillStyle = `rgba(6, 182, 212, ${alpha * 0.8})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};

interface ClipDisplayProps {
    clip: Clip;
    isActive: boolean;
    onDownload: () => void;
}

const ClipDisplay: React.FC<ClipDisplayProps> = ({ clip, isActive, onDownload }) => {
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (clip.status === 'completed' && clip.urls && clip.urls.length > 1) {
            intervalRef.current = window.setInterval(() => {
                setCurrentFrameIndex(prev => (prev + 1) % clip.urls!.length);
            }, 500);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [clip.status, clip.urls]);

    const renderContent = () => {
        if (clip.status === 'idle') {
            return (
                <div className="flex items-center justify-center h-full text-[var(--theme-text-subtitle)]">
                    <p>Waiting...</p>
                </div>
            );
        }

        if (clip.status === 'generating') {
            return (
                <div className="relative w-full h-full">
                    <GeneratingAnimation />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-cyan-200 font-semibold animate-pulse">Generating...</p>
                    </div>
                </div>
            );
        }

        if (clip.status === 'error') {
            return (
                <div className="flex items-center justify-center h-full text-red-400">
                    <p>Error generating clip</p>
                </div>
            );
        }

        if (clip.status === 'completed' && clip.urls) {
            return (
                <div className="relative w-full h-full group">
                    <img
                        src={clip.urls[currentFrameIndex]}
                        alt={`Clip ${clip.id + 1} - Frame ${currentFrameIndex + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                    />
                    {clip.urls.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                            {currentFrameIndex + 1} / {clip.urls.length}
                        </div>
                    )}
                    <button
                        onClick={onDownload}
                        className="absolute top-2 right-2 p-2 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)]"
                        title="Download clip"
                        aria-label="Download clip frames"
                    >
                        <DownloadIcon className="w-4 h-4 text-white" />
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                isActive
                    ? 'border-[var(--theme-accent1)] shadow-[0_0_20px_var(--theme-glow-heavy)] scale-105'
                    : 'border-[var(--theme-border-color)]'
            }`}
            style={{ aspectRatio: '16/9', minHeight: '200px' }}
        >
            <div className="absolute inset-0 bg-[var(--theme-bg-secondary)]">
                {renderContent()}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-xs text-white line-clamp-2">{clip.scriptText}</p>
            </div>
        </div>
    );
};

export default ClipDisplay;
