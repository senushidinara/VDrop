import React, { useEffect, useRef } from 'react';

interface Agent {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxLife: number;
  life: number;
}

export const RaindropVisualization: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const agentsRef = useRef<Agent[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const spawnAgent = (x?: number, y?: number): Agent => {
            const life = Math.random() * 200 + 100;
            return {
                id: Math.random(),
                x: x ?? Math.random() * canvas.width,
                y: y ?? Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                radius: Math.random() * 4 + 6,
                maxLife: life,
                life: life,
            };
        };

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const agentCount = Math.floor(canvas.width * canvas.height / 25000);
            agentsRef.current = [];
            for (let i = 0; i < agentCount; i++) {
                agentsRef.current.push(spawnAgent());
            }
        };
        
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw agents
            agentsRef.current.forEach((agent, index) => {
                agent.x += agent.vx;
                agent.y += agent.vy;
                agent.life--;

                if (agent.x < agent.radius || agent.x > canvas.width - agent.radius) agent.vx *= -1;
                if (agent.y < agent.radius || agent.y > canvas.height - agent.radius) agent.vy *= -1;
                
                if (agent.life <= 0) {
                    agentsRef.current[index] = spawnAgent();
                    return;
                }

                const alpha = agent.life / agent.maxLife;
                const gradient = ctx.createRadialGradient(agent.x, agent.y, 0, agent.x, agent.y, agent.radius);
                gradient.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.8})`);
                gradient.addColorStop(0.5, `rgba(103, 232, 249, ${alpha * 0.5})`);
                gradient.addColorStop(1, `rgba(6, 182, 212, 0)`);
                
                ctx.beginPath();
                ctx.arc(agent.x, agent.y, agent.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            // Draw connections
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i < agentsRef.current.length; i++) {
                for (let j = i + 1; j < agentsRef.current.length; j++) {
                    const a1 = agentsRef.current[i];
                    const a2 = agentsRef.current[j];
                    const dx = a1.x - a2.x;
                    const dy = a1.y - a2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(a1.x, a1.y);
                        ctx.lineTo(a2.x, a2.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameRef.current = requestAnimationFrame(render);
        };

        setup();
        render();

        const handleResize = () => setup();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            agentsRef.current = [];
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" />;
};
