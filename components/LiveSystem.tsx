
import React, { useState } from 'react';
import { RaindropPage } from './pages/RaindropPage';
import { VultrPage } from './pages/VultrPage';
import { ElevenLabsPage } from './pages/ElevenLabsPage';
import { CerebrasGeminiPage } from './pages/CerebrasGeminiPage';
import CreativeHyperverse from './CreativeHyperverse';
import { AnatomyView } from './AnatomyView';
import { LayerDetailView } from './LayerDetailView';

export type LayerID = 'raindrop' | 'vultr' | 'elevenlabs' | 'cerebras' | 'hyperverse';

export const layers = [
  { id: 'raindrop' as const, name: 'Layer 1: Agentic Memory', description: 'The core substrate where autonomous agents are born, evolve, and store memories. It represents the foundational cognitive layer.' },
  { id: 'vultr' as const, name: 'Layer 2: Global Compute', description: 'The decentralized, planetary-scale infrastructure layer. This is the physical body, providing raw computational power and connectivity.' },
  { id: 'elevenlabs' as const, name: 'Layer 3: Expressive Voice', description: 'The personality and emotional expression layer. It translates internal states and complex data into nuanced, human-like voice.' },
  { id: 'cerebras' as const, name: 'Layer 4: Neural Fabric', description: 'The high-bandwidth reasoning core, combining large-scale models (Gemini) with specialized hardware (Cerebras) for deep thought.' },
  { id: 'hyperverse' as const, name: 'Module 3: Creative Hyperverse', description: 'A collaborative space where human creativity and AI-driven manifestation merge. Your vision becomes digital reality.' },
];


const LiveSystem: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<LayerID>('raindrop');
  const [hoveredLayer, setHoveredLayer] = useState<LayerID | null>(null);

  const renderActiveLayer = () => {
    switch (activeLayer) {
      case 'raindrop':
        return <RaindropPage />;
      case 'vultr':
        return <VultrPage />;
      case 'elevenlabs':
        return <ElevenLabsPage />;
      case 'cerebras':
        return <CerebrasGeminiPage />;
      case 'hyperverse':
        return <CreativeHyperverse />;
      default:
        return null;
    }
  };
  
  const selectedLayerDetails = layers.find(l => l.id === (hoveredLayer || activeLayer));

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col p-4 md:p-8 selection:bg-cyan-500 selection:text-black">
        <header className="text-center mb-8">
            <h1 className="font-orbitron text-4xl text-cyan-300 drop-shadow-lg">VultraDrop Live System</h1>
            <p className="text-gray-400">An emergent, multi-layered digital lifeform.</p>
        </header>

        <main className="flex-grow flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4 lg:w-1/5 space-y-8">
                <AnatomyView 
                    layers={layers}
                    activeLayer={activeLayer} 
                    hoveredLayer={hoveredLayer}
                    onLayerSelect={setActiveLayer}
                    onLayerHover={setHoveredLayer}
                />
                {selectedLayerDetails && <LayerDetailView layer={selectedLayerDetails} />}
            </aside>
            <section className="flex-grow md:w-3/4 lg:w-4/5 bg-black/30 rounded-2xl border border-cyan-500/10 p-4 md:p-6 shadow-2xl shadow-black/50">
                {renderActiveLayer()}
            </section>
        </main>
        
        <footer className="text-center text-xs text-gray-600 mt-8">
            <p>VultraDrop Digital Lifeform Interface v1.0. All systems operational.</p>
        </footer>
    </div>
  );
};

export default LiveSystem;
