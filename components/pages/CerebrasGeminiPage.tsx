
import React from 'react';
import { GeminiCerebrasVisualization } from '../visualizations';

export const CerebrasGeminiPage: React.FC = () => {
  return (
    <div>
        <div className="text-center mb-6">
            <h2 className="font-orbitron text-2xl text-cyan-300">Layer 4: Neural Fabric</h2>
            <p className="text-gray-400">The high-bandwidth reasoning core for deep, parallel thought.</p>
        </div>
        <GeminiCerebrasVisualization />
    </div>
  );
};
