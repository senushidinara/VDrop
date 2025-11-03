import React, { useState, useEffect, useRef } from 'react';
import { DownloadIcon } from './IconComponents';
import { Clip } from '../types';

const GeneratingAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        const particles: { x: number; y: number; vx: number; vy: number; life: number; }[] = [];
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

        let animationFrameId: number;
        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
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
                
                const opacity = Math.max(0, p.life / 100);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(107, 230, 255, ${opacity})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        animate(0);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <p className="relative text-xs text-cyan-200 font-light z-10">Manifesting Scene...</p>
        </div>
    );
};

interface ClipDisplayProps {
  clip: Clip;
  onDownload: (urls: string[], id: number) => void;
  isActive: boolean;
}

const ClipDisplay: React.FC<ClipDisplayProps> = ({ clip, onDownload, isActive }) => {
  const { status, urls, id } = clip;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (status === 'completed' && urls && urls.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % urls.length);
      }, 700); // Animation speed
      return () => clearInterval(interval);
    }
  }, [status, urls]);

  const renderContent = () => {
    switch (status) {
      case 'generating':
        return <GeneratingAnimation />;
      case 'completed':
        if (urls && urls.length > 0) {
          return (
            <div className="relative w-full h-full group">
               {urls.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`Generated clip ${id} frame ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => onDownload(urls, id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 backdrop-blur-sm shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label={`Download scene ${id + 1} images`}
                    >
                    <DownloadIcon className="w-5 h-5" />
                    Download
                </button>
              </div>
            </div>
          );
        }
        return <p className="flex items-center justify-center h-full text-gray-400">Error: URLs missing.</p>;
      case 'error':
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-2">
                <p className="text-red-400 text-sm font-semibold">Scene Failed</p>
                <p className="text-xs text-gray-500 mt-1">Please try again.</p>
            </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 text-sm font-orbitron">Awaiting Vision...</p>
          </div>
        );
    }
  };

  return (
    <div 
      className={`panel-corners aspect-video bg-black/50 rounded-lg shadow-lg overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--theme-glow-light)] ${isActive ? 'border-[var(--theme-accent2)] shadow-2xl shadow-[var(--theme-glow-heavy)] scale-105 ring-4 ring-[var(--theme-accent2)]/50' : 'border-[var(--theme-border-color)]'}`}
      role="article"
      aria-label={`Scene ${id + 1} - ${status}`}
    >
        <div className="w-full h-full relative">
          {renderContent()}
          {isActive && (
            <div className="absolute top-2 right-2 bg-[var(--theme-accent2)] text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              PLAYING
            </div>
          )}
        </div>
    </div>
  );
};

export default ClipDisplay;
