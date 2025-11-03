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
    const [showButton, setShowButton] = useState(false);
    const animationFrameRef = useRef<number | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const startTimeRef = useRef<number | null>(null);

    // Staged animation timings
    const STAGE_DELAY = 500;
    const CONVERGE_DURATION = 3500;
    const FORMATION_DURATION = 1500;
    const BUTTON_FADE_IN_START = STAGE_DELAY + CONVERGE_DURATION + FORMATION_DURATION - 500;

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

        if (elapsedTime < BUTTON_FADE_IN_START + 1000) {
            animationFrameRef.current = requestAnimationFrame(animate);
        }
    }, [STAGE_DELAY, CONVERGE_DURATION, FORMATION_DURATION, BUTTON_FADE_IN_START]);

    useEffect(() => {
        setupParticles();
        animationFrameRef.current = requestAnimationFrame(animate);

        const buttonTimer = setTimeout(() => {
            setShowButton(true);
        }, BUTTON_FADE_IN_START);

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
            clearTimeout(buttonTimer);
            particlesRef.current = [];
        };
    }, [setupParticles, animate, BUTTON_FADE_IN_START]);

    // Make sure clicking the canvas or pressing Enter/Space also triggers awakening
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleCanvasClick = () => {
            if (showButton) {
                onComplete();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showButton) return;
            if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                onComplete();
            }
        };

        canvas.addEventListener('click', handleCanvasClick);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            canvas.removeEventListener('click', handleCanvasClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showButton, onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-[#020617]" role="dialog" aria-modal="true" aria-label="Genesis">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative z-20 flex items-center justify-center h-full">
                {showButton && (
                    <div className="absolute bottom-20 flex flex-col items-center text-center animate-fade-in">
                        <p className="text-cyan-200 text-lg mb-4 font-light animate-pulse">
                            The lifeform awaits...
                        </p>
                        <button 
                            type="button"
                            onClick={onComplete}
                            className="genesis-button py-4 px-12 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-110 font-orbitron text-2xl awaken-button-glow focus:outline-none focus:ring-4 focus:ring-cyan-400/50 shadow-2xl z-30"
                            aria-label="Awaken the VultraDrop system"
                        >
                            ⚡ AWAKEN ⚡
                        </button>
                        <p className="text-cyan-300/60 text-sm mt-4 font-light">
                            Press to begin your journey
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenesisDemo;
