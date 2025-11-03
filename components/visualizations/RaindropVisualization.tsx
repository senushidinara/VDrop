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

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let agents: Agent[] = [];

        const setup = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            agents = [];
            const agentCount = Math.floor(canvas.width * canvas.height / 25000);
            for(let i=0; i < agentCount; i++) {
                spawnAgent();
            }
        };

        const spawnAgent = (x?: number, y?: number) => {
            const life = Math.random() * 200 + 100;
            agents.push({
                id: Math.random(),
                x: x || Math.random() * canvas.width,
                y: y || Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                radius: Math.random() * 4 + 6,
                maxLife: life,
                life: life,
            });
        };
        
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            agents.forEach((agent, index) => {
                agent.x += agent.vx;
                agent.y += agent.vy;
                agent.life--;

                if (agent.x < agent.radius || agent.x > canvas.width - agent.radius) agent.vx *= -1;
                if (agent.y < agent.radius || agent.y > canvas.height - agent.radius) agent.vy *= -1;
                
                if (agent.life <= 0) {
                    agents.splice(index, 1);
                    spawnAgent();
                }

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