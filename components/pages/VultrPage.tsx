
import React from 'react';
import { VultrVisualization } from '../visualizations';

export const VultrPage: React.FC = () => {
  return (
    <div>
        <div className="text-center mb-6">
            <h2 className="font-orbitron text-2xl text-cyan-300">Layer 2: Global Compute</h2>
            <p className="text-gray-400">The decentralized, planetary-scale infrastructure layer providing raw power.</p>
        </div>
        <VultrVisualization />
    </div>
  );
};
