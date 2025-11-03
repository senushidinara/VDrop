import React, { useState, useRef } from 'react';
import { generateNarration } from '../services/elevenLabsService';
import { SpeakerWaveIcon } from './IconComponents';

interface VoicePreset {
  id: string;
  name: string;
  description: string;
  stability: number;
  similarityBoost: number;
  style: number;
  icon: string;
}

const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'Intense and theatrical delivery',
    stability: 0.3,
    similarityBoost: 0.9,
    style: 0.8,
    icon: '🎭',
  },
  {
    id: 'calm',
    name: 'Calm',
    description: 'Soothing and peaceful narration',
    stability: 0.8,
    similarityBoost: 0.6,
    style: 0.3,
    icon: '🧘',
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'Upbeat and exciting',
    stability: 0.4,
    similarityBoost: 0.8,
    style: 0.9,
    icon: '⚡',
  },
  {
    id: 'mysterious',
    name: 'Mysterious',
    description: 'Enigmatic and intriguing',
    stability: 0.6,
    similarityBoost: 0.7,
    style: 0.6,
    icon: '🔮',
  },
  {
    id: 'heroic',
    name: 'Heroic',
    description: 'Bold and inspiring',
    stability: 0.5,
    similarityBoost: 0.85,
    style: 0.7,
    icon: '🦸',
  },
];

const SAMPLE_TEXTS = [
  'In the beginning, there was only darkness. Then, a spark of consciousness emerged from the void.',
  'The city never sleeps, its neon heart beating through the rain-soaked streets.',
  'Deep in the enchanted forest, ancient magic still flows through every leaf and stone.',
  'Across the vast expanse of space, a lone ship drifts toward an unknown destiny.',
  'The storm approaches, bringing with it the fury of nature unleashed.',
];

interface VoiceLabProps {
  onClose: () => void;
}

const VoiceLab: React.FC<VoiceLabProps> = ({ onClose }) => {
  const [text, setText] = useState(SAMPLE_TEXTS[0]);
  const [selectedPreset, setSelectedPreset] = useState<VoicePreset>(VOICE_PRESETS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter some text to narrate');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);

    try {
      const url = await generateNarration(text);
      setAudioUrl(url);
      
      // Auto-play the generated audio
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Failed to generate narration');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePresetSelect = (preset: VoicePreset) => {
    setSelectedPreset(preset);
    setAudioUrl(null); // Clear previous audio when changing preset
  };

  const handleSampleSelect = (sample: string) => {
    setText(sample);
    setAudioUrl(null);
  };

  return (
    <div className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in-fast overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-start mb-6">
        <div className="animate-slide-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-orbitron text-[var(--theme-text-title)] mb-2 flex items-center gap-3">
            <SpeakerWaveIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            Voice Lab
          </h1>
          <p className="text-sm sm:text-base text-[var(--theme-text-subtitle)]">
            Experiment with AI voice synthesis and emotional delivery
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[var(--theme-bg-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)]"
          title="Close Voice Lab"
          aria-label="Close voice lab"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice Presets */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-orbitron font-bold text-[var(--theme-text-title)] mb-4">
            Voice Presets
          </h2>
          <div className="space-y-3">
            {VOICE_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPreset.id === preset.id
                    ? 'border-[var(--theme-accent1)] bg-[var(--theme-bg-secondary)] shadow-[0_0_20px_var(--theme-glow-light)]'
                    : 'border-[var(--theme-border-color)] bg-[var(--theme-bg-tertiary)] hover:border-[var(--theme-accent2)]'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{preset.icon}</span>
                  <span className="font-bold text-[var(--theme-text-title)]">{preset.name}</span>
                </div>
                <p className="text-sm text-[var(--theme-text-subtitle)]">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input & Controls */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Sample Texts */}
          <div>
            <h2 className="text-xl font-orbitron font-bold text-[var(--theme-text-title)] mb-4">
              Sample Texts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_TEXTS.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleSelect(sample)}
                  className="p-3 rounded-lg border border-[var(--theme-border-color)] bg-[var(--theme-bg-tertiary)] hover:border-[var(--theme-accent1)] transition-all text-left text-sm"
                >
                  {sample.substring(0, 60)}...
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div>
            <h2 className="text-xl font-orbitron font-bold text-[var(--theme-text-title)] mb-4">
              Your Text
            </h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to hear narrated..."
              className="w-full h-40 p-4 rounded-lg border border-[var(--theme-border-color)] bg-[var(--theme-bg-secondary)] text-[var(--theme-text-light)] placeholder-[var(--theme-text-subtitle)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)] resize-none custom-scrollbar"
              maxLength={500}
            />
            <div className="mt-2 text-sm text-[var(--theme-text-subtitle)] text-right">
              {text.length} / 500 characters
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="w-full py-4 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-[var(--theme-accent1)] to-[var(--theme-accent2)] text-white hover:shadow-[0_0_30px_var(--theme-glow-heavy)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Voice...
              </>
            ) : (
              <>
                <SpeakerWaveIcon className="w-6 h-6" />
                Generate Narration
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-200">
              <p className="font-bold mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Audio Player */}
          {audioUrl && (
            <div className="p-6 rounded-lg border-2 border-[var(--theme-accent1)] bg-[var(--theme-bg-secondary)] shadow-[0_0_30px_var(--theme-glow-light)] animate-fade-in">
              <h3 className="text-lg font-bold text-[var(--theme-text-title)] mb-4 flex items-center gap-2">
                <span className="text-2xl">{selectedPreset.icon}</span>
                Generated Narration - {selectedPreset.name}
              </h3>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full"
                style={{ filter: 'hue-rotate(180deg) saturate(2)' }}
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => audioRef.current?.play()}
                  className="flex-1 py-2 px-4 rounded-lg bg-[var(--theme-accent1)] text-white hover:bg-[var(--theme-accent2)] transition-colors"
                >
                  Play
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = audioUrl;
                    link.download = `VultraDrop_Voice_${selectedPreset.name}_${Date.now()}.mp3`;
                    link.click();
                  }}
                  className="flex-1 py-2 px-4 rounded-lg border border-[var(--theme-accent1)] text-[var(--theme-accent1)] hover:bg-[var(--theme-accent1)] hover:text-white transition-all"
                >
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceLab;
