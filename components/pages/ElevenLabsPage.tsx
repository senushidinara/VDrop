
import React from 'react';
import { ElevenLabsVisualization } from '../visualizations';

export const ElevenLabsPage: React.FC = () => {
  return (
    <div>
        <div className="text-center mb-6">
            <h2 className="font-orbitron text-2xl text-cyan-300">Layer 3: Expressive Voice</h2>
            <p className="text-gray-400">The personality and emotional expression layer, translating data into voice.</p>
        </div>
        <ElevenLabsVisualization />
    </div>
  );
};
