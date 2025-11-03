
import React from 'react';
import { RaindropVisualization } from '../visualizations';

export const RaindropPage: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="font-orbitron text-2xl text-cyan-300">Layer 1: Agentic Memory</h2>
        <p className="text-gray-400">The substrate where autonomous agents are born, evolve, and persist.</p>
      </div>
      <RaindropVisualization />
    </div>
  );
};
