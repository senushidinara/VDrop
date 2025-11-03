import React, { useState, useEffect, useRef, useCallback } from 'react';

// Easing function for smooth animation
const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface Particle {
    x: number;
    y: number;
    size: number;
    targetX: number;
    targetY: number;
    initialX: number;
    initialY: number;
    delay: number;
}

const GenesisDemo: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showButton, setShowButton] = useState(true); // always show
    const animationFrameRef = useRef<number | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const startTimeRef = useRef<number | null>(null);
    const awakenBtnRef = useRef<HTMLButtonElement | null>(null);

    // Staged animation timings
    const STAGE_DELAY = 500;
    const CONVERGE_DURATION = 3500;
    const FORMATION_DURATION = 1500;

    const setupParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particlesRef.current = [];

        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        if (!offscreenCtx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        
        const fontSize = Math.min(canvas.width * 0.2, 180);
        offscreenCtx.font = `900 ${fontSize}px 'Orbitron', sans-serif`;
        offscreenCtx.fillStyle = 'white';
        offscreenCtx.textAlign = 'center';
        offscreenCtx.textBaseline = 'middle';
        offscreenCtx.fillText('VULTRA', canvas.width / 2, canvas.height / 2 - fontSize * 0.6);
        offscreenCtx.fillText('DROP', canvas.width / 2, canvas.height / 2 + fontSize * 0.6);
        
        const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Optimize particle count based on screen size
        const step = Math.max(3, Math.floor(5 / dpr));
        const particles: Particle[] = [];
        
        for (let y = 0; y < imageData.height; y += step) {
            for (let x = 0; x < imageData.width; x += step) {
                const i = (y * imageData.width + x) * 4;
                if (imageData.data[i + 3] > 128) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.max(canvas.width, canvas.height) * (0.6 + Math.random() * 0.4);
                    
                    particles.push({
                        x: 0,
                        y: 0,
                        size: Math.random() * 1.5 * dpr + 0.5,
                        targetX: x,
                        targetY: y,
                        initialX: canvas.width / 2 + Math.cos(angle) * radius,
                        initialY: canvas.height / 2 + Math.sin(angle) * radius,
                        delay: Math.random() * 500,
                    });
                }
            }
        }
        
        particlesRef.current = particles;
    }, []);

    const animate = useCallback((timestamp: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsedTime = timestamp - startTimeRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const convergeStartTime = STAGE_DELAY;
        const formationStartTime = convergeStartTime + CONVERGE_DURATION;

        particlesRef.current.forEach(p => {
            if (elapsedTime > convergeStartTime + p.delay) {
                const convergeProgress = Math.min((elapsedTime - (convergeStartTime + p.delay)) / CONVERGE_DURATION, 1);
                const easedConvergeProgress = easeInOutCubic(convergeProgress);
                
                const currentX = p.initialX + (p.targetX - p.initialX) * easedConvergeProgress;
                const currentY = p.initialY + (p.targetY - p.initialY) * easedConvergeProgress;
                let alpha = 0.2 + easedConvergeProgress * 0.8;
                let size = p.size;

                if (elapsedTime > formationStartTime) {
                    const formationProgress = Math.min((elapsedTime - formationStartTime) / FORMATION_DURATION, 1);
                    alpha = 1 - formationProgress;
                    size = p.size * (1 + (1 - formationProgress) * 2);
                    ctx.shadowBlur = (1 - formationProgress) * 20;
                    ctx.shadowColor = 'white';
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.beginPath();
                ctx.arc(currentX, currentY, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(191, 219, 254, ${alpha})`;
                ctx.fill();
            }
        });

        ctx.shadowBlur = 0;

        // keep animating indefinitely for subtle motion
        animationFrameRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        setupParticles();
        animationFrameRef.current = requestAnimationFrame(animate);

        const handleResize = () => {
            setupParticles();
            startTimeRef.current = null;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            particlesRef.current = [];
        };
    }, [setupParticles, animate]);

    // Make sure clicking the canvas or pressing Enter/Space also triggers awakening
    useEffect(() => {
        const canvas = canvasRef.current;
        const handleCanvasClick = () => {
            onComplete();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                onComplete();
            }
        };

        canvas?.addEventListener('click', handleCanvasClick);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            canvas?.removeEventListener('click', handleCanvasClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onComplete]);

    // focus the button for accessibility
    useEffect(() => {
        awakenBtnRef.current?.focus();
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-[#020617]" role="dialog" aria-modal="true" aria-label="Genesis">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto">
                <div className="panel-corners bg-[rgba(0,0,0,0.55)] backdrop-filter backdrop-blur-lg border border-[var(--theme-border-color)] rounded-2xl p-8 w-[820px] max-w-[90%] text-center pointer-events-auto shadow-2xl">
                    <div className="mb-6">
                        <svg width="220" height="220" viewBox="0 0 100 100" className="mx-auto opacity-95">
                            <path d="M10 15 L50 5 L90 15 L90 65 L50 95 L10 65 Z" fill="none" stroke="rgba(226, 241, 254, 0.95)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h2 className="font-orbitron text-3xl sm:text-4xl font-bold text-[var(--theme-text-title)] mb-4 drop-shadow-lg">Genesis</h2>
                    <p className="text-[var(--theme-text-light)] max-w-[70%] mx-auto mb-6">Systems dormant. Conscious substrate uninitialized. From the void, I awaken.</p>

                    <div className="flex flex-col items-center gap-4">
                        <button
                            ref={awakenBtnRef}
                            type="button"
                            onClick={onComplete}
                            className="genesis-button py-6 px-14 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-full hover:from-cyan-300 hover:to-blue-400 transition-transform transform hover:scale-105 font-orbitron text-3xl awaken-button-glow focus:outline-none focus:ring-8 focus:ring-cyan-400/30 shadow-[0_30px_80px_rgba(13,42,76,0.6)] z-60"
                            aria-label="Awaken the VultraDrop system"
                        >
                            ⚡ AWAKEN ⚡
                        </button>

                        <p className="text-cyan-300/60 text-sm mt-2 font-light">Press Enter or Space • Click anywhere to awaken</p>
                        <p className="text-[var(--theme-text-subtitle)] text-xs mt-2 opacity-80">Use arrow keys to navigate • Press H for Hyperverse • Press G for Gallery</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenesisDemo;
