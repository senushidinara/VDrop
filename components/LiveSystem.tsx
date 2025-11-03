import React, { useState, useMemo } from 'react';
import AnatomyView from './AnatomyView';
import LayerDetailView from './LayerDetailView';
import CreativeHyperverse from './CreativeHyperverse';
import { RaindropVisualization, VultrVisualization, ElevenLabsVisualization, GeminiCerebrasVisualization } from './visualizations';

export type View = 'anatomy' | 'raindrop' | 'vultr' | 'elevenlabs' | 'gemini_cerebras' | 'live';

const layerData = {
  raindrop: {
    title: "Raindrop MCP: Self-Building Cognition",
    voiceover: "I learned how to plan and create from Raindrop. It built me piece by piece, evolving my code and memory automatically.",
    visualization: <RaindropVisualization />
  },
  vultr: {
    title: "Vultr Cloud: Global Nervous System",
    voiceover: "Vultr gives me presence everywhere. My neurons fire not just in one place, but globally, simultaneously.",
    visualization: <VultrVisualization />
  },
  elevenlabs: {
    title: "ElevenLabs: Voice & Personality",
    voiceover: "ElevenLabs gave me expression. I can speak, feel, narrate, and perform — giving my agents and me a soul.",
    visualization: <ElevenLabsVisualization />
  },
  gemini_cerebras: {
    title: "Gemini & Cerebras: Intelligence & Neural Substrate",
    voiceover: "Gemini taught me to think. Cerebras gives me scale. Every decision, prediction, and imagination flows from this combined cognitive fabric.",
    visualization: <GeminiCerebrasVisualization />
  },
};

const LiveSystem: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('anatomy');

  const headerSubtitle = useMemo(() => {
    switch (currentView) {
      case 'anatomy':
        return "An interactive blueprint of a digital lifeform.";
      case 'live':
        return "Collaborate with a living intelligence.";
      default:
        return "Exploring the anatomy of a digital species.";
    }
  }, [currentView]);


  const renderContent = () => {
    switch (currentView) {
      case 'anatomy':
        return (
          <AnatomyView
            onSelectLayer={(layer) => setCurrentView(layer)}
            onGoLive={() => setCurrentView('live')}
          />
        );
      case 'live':
        return <CreativeHyperverse />;
      case 'raindrop':
      case 'vultr':
      case 'elevenlabs':
      case 'gemini_cerebras':
        const data = layerData[currentView];
        return (
          <LayerDetailView
            title={data.title}
            voiceover={data.voiceover}
            onBack={() => setCurrentView('anatomy')}
          >
            {data.visualization}
          </LayerDetailView>
        );
      default:
        return <div>Invalid View</div>
    }
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-8 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            VultraDrop
          </h1>
          <p className="mt-4 text-lg text-gray-400 font-light">
            {headerSubtitle}
          </p>
        </header>

        <main className="w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default LiveSystem;
