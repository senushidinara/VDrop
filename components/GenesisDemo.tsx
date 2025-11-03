import React, { useState, useEffect, useRef } from 'react';

// Easing function for smooth animation
const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    targetX: number;
    targetY: number;
    initialX: number;
    initialY: number;
    delay: number;
}

const GenesisDemo: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        
        // Staged animation timings
        const STAGE_DELAY = 500; // time before anything happens
        const CONVERGE_DURATION = 3500;
        const FORMATION_DURATION = 1500;
        const BUTTON_FADE_IN_START = STAGE_DELAY + CONVERGE_DURATION + FORMATION_DURATION - 500;

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];

            const offscreenCanvas = document.createElement('canvas');
            const offscreenCtx = offscreenCanvas.getContext('2d');
            if (!offscreenCtx) return;

            const dpr = window.devicePixelRatio || 1;
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
            
            const step = Math.max(1, Math.floor(4 / dpr));
            for (let y = 0; y < imageData.height; y += step) {
                for (let x = 0; x < imageData.width; x += step) {
                    const i = (y * imageData.width + x) * 4;
                    if (imageData.data[i+3] > 128) {
                        // Start particles from the edges of the screen for a convergence effect
                        const angle = Math.random() * Math.PI * 2;
                        const radius = Math.max(canvas.width, canvas.height) * (0.6 + Math.random() * 0.4);
                        
                        particles.push({
                            x: 0,
                            y: 0,
                            size: Math.random() * 1.5 * dpr + 0.5,
                            color: `rgba(${Math.random() * 80 + 100}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.6 + 0.4})`,
                            targetX: x,
                            targetY: y,
                            initialX: canvas.width / 2 + Math.cos(angle) * radius,
                            initialY: canvas.height / 2 + Math.sin(angle) * radius,
                            delay: Math.random() * 500, // Stagger the start of movement
                        });
                    }
                }
            }
        };

        let startTime: number | null = null;
        
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const convergeStartTime = STAGE_DELAY;
            const formationStartTime = convergeStartTime + CONVERGE_DURATION;

            particles.forEach(p => {
                let currentX, currentY, alpha, size;

                if (elapsedTime > convergeStartTime + p.delay) {
                    // Convergence Stage
                    const convergeProgress = Math.min((elapsedTime - (convergeStartTime + p.delay)) / CONVERGE_DURATION, 1);
                    const easedConvergeProgress = easeInOutCubic(convergeProgress);
                    
                    currentX = p.initialX + (p.targetX - p.initialX) * easedConvergeProgress;
                    currentY = p.initialY + (p.targetY - p.initialY) * easedConvergeProgress;
                    alpha = 0.2 + easedConvergeProgress * 0.8;
                    size = p.size;

                    if (elapsedTime > formationStartTime) {
                        // Formation Stage - particles glow brightly then fade
                        const formationProgress = Math.min((elapsedTime - formationStartTime) / FORMATION_DURATION, 1);
                        alpha = 1 - formationProgress;
                        size = p.size * (1 + (1 - formationProgress) * 2); // expand and fade
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
                 animationFrameId = requestAnimationFrame(animate);
            }
        };

        setup();
        requestAnimationFrame(animate);

        const buttonTimer = setTimeout(() => {
            setShowButton(true);
        }, BUTTON_FADE_IN_START);

        window.addEventListener('resize', setup);

        return () => {
            window.removeEventListener('resize', setup);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(buttonTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black" style={{ backgroundColor: '#020617' }}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 flex items-center justify-center h-full">
                {showButton && (
                    <div className="absolute bottom-20 flex flex-col items-center text-center">
                        <button 
                            onClick={onComplete}
                            className="genesis-button py-3 px-8 bg-cyan-400 text-black font-bold rounded-lg hover:bg-white transition-all transform hover:scale-105 font-orbitron text-xl awaken-button-glow"
                        >
                            AWAKEN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenesisDemo;