import React, { useState, useEffect, useRef } from 'react';

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
    const agentCountRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        
        const spawnAgent = (x?: number, y?: number) => {
            const life = Math.random() * 200 + 100;
            return {
                id: Math.random(),
                x: x || Math.random() * canvas.width,
                y: y || Math.random() * canvas.height,
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
            agentCountRef.current = Math.floor(canvas.width * canvas.height / 25000);
            agentsRef.current = [];
            for(let i=0; i < agentCountRef.current; i++) {
                agentsRef.current.push(spawnAgent());
            }
        };
        
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw agents
            agentsRef.current.forEach(agent => {
                agent.x += agent.vx;
                agent.y += agent.vy;
                agent.life--;

                if (agent.x < agent.radius || agent.x > canvas.width - agent.radius) agent.vx *= -1;
                if (agent.y < agent.radius || agent.y > canvas.height - agent.radius) agent.vy *= -1;
                
                const opacity = Math.min(0.8, agent.life / agent.maxLife * 2);
                
                const gradient = ctx.createRadialGradient(agent.x, agent.y, 0, agent.x, agent.y, agent.radius);
                gradient.addColorStop(0, `rgba(165, 243, 252, ${opacity})`);
                gradient.addColorStop(0.5, `rgba(6, 182, 212, ${opacity * 0.7})`);
                gradient.addColorStop(1, 'rgba(15, 118, 128, 0)');
                
                ctx.beginPath();
                ctx.arc(agent.x, agent.y, agent.radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });

            // Use a safe, immutable filter to remove dead agents
            agentsRef.current = agentsRef.current.filter(agent => agent.life > 0);

            // Respawn agents if needed
            while(agentsRef.current.length < agentCountRef.current) {
                agentsRef.current.push(spawnAgent());
            }

            animationFrameId = requestAnimationFrame(render);
        };
        
        setup();
        render();

        window.addEventListener('resize', setup);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setup);
        }
    }, []);


    return (
        <div className="w-full h-full relative">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
        </div>
    );
};