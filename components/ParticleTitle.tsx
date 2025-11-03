import React, { useEffect, useRef, useCallback } from 'react';

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const ParticleTitle: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const animRef = useRef<number | null>(null);

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // draw text to offscreen to pick points
      const off = document.createElement('canvas');
      off.width = window.innerWidth;
      off.height = window.innerHeight;
      const octx = off.getContext('2d');
      if (!octx) return;
      const fontSize = Math.min(window.innerWidth * 0.08, 120);
      octx.fillStyle = 'black';
      octx.font = `900 ${fontSize}px Orbitron, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText('VULTRA', window.innerWidth / 2, window.innerHeight / 2 - fontSize * 0.55);
      octx.fillText('DROP', window.innerWidth / 2, window.innerHeight / 2 + fontSize * 0.55);

      const img = octx.getImageData(0, 0, off.width, off.height);
      const step = Math.max(2, Math.floor(6 / dpr));
      const pts: any[] = [];
      for (let y = 0; y < img.height; y += step) {
        for (let x = 0; x < img.width; x += step) {
          const i = (y * img.width + x) * 4;
          if (img.data[i + 3] > 128) {
            const angle = Math.random() * Math.PI * 2;
            const rad = Math.max(off.width, off.height) * (0.6 + Math.random() * 0.5);
            pts.push({
              x: Math.random() * off.width,
              y: Math.random() * off.height,
              tx: x,
              ty: y,
              ox: off.width / 2 + Math.cos(angle) * rad,
              oy: off.height / 2 + Math.sin(angle) * rad,
              size: Math.random() * 1.6 + 0.6,
              delay: Math.random() * 800,
            });
          }
        }
      }
      particlesRef.current = pts;
    };

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let start: number | null = null;

    const colors = ['rgba(125,211,252,', 'rgba(251,207,232,', 'rgba(196,181,253,', 'rgba(255,238,210,'];

    const loop = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      particlesRef.current.forEach((p: any, idx: number) => {
        const progress = Math.max(0, Math.min(1, (elapsed - p.delay) / 1300));
        const eased = easeInOutCubic(progress);
        const x = p.ox + (p.tx - p.ox) * eased;
        const y = p.oy + (p.ty - p.oy) * eased;
        const size = p.size * (1 + eased * 1.2);

        ctx.beginPath();
        const c = colors[idx % colors.length];
        const alpha = 0.25 + eased * 0.85;
        ctx.fillStyle = `${c}${alpha})`;
        ctx.shadowBlur = 8 + eased * 18;
        ctx.shadowColor = c.replace('rgba', 'rgba');
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => setup(), [setup]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80 -z-10" aria-hidden="true" />
  );
};

export default ParticleTitle;
