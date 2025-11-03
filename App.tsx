import React, { useState } from 'react';
import { generateImageSequence } from './services/geminiService';
import { generateNarration } from './services/elevenLabsService';
import ClipDisplay from './components/VideoPlayer';
import { AspectRatio, ImageSettings, Clip } from './types';
import { FilmIcon, RefreshIcon } from './components/IconComponents';


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [narration, setNarration] = useState<string>('');
  const [settings, setSettings] = useState<ImageSettings>({ aspectRatio: '16:9' });
  const [clips, setClips] = useState<Clip[]>(() => Array.from({ length: 10 }, (_, i) => ({ id: i, urls: null, status: 'idle', audioUrl: null })));
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Orchestrates the entire clip generation process when the user clicks "Generate".
   * It validates the user's prompt, sets the application state to 'generating',
   * and then iterates through 10 clip slots. For each slot, it calls the
   * Gemini service to generate an image sequence and, if a narration script is provided,
   * calls the ElevenLabs service to generate audio. It updates the state of each
   * clip individually with the results ('completed' or 'error').
   */
  const handleGenerateClick = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to describe your vision.');
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    const initialClips = Array.from({ length: 10 }, (_, i) => ({ id: i, urls: null, status: 'idle' as const, audioUrl: null }));
    setClips(initialClips);

    for (const clip of initialClips) {
      setClips(prevClips =>
        prevClips.map(c => c.id === clip.id ? { ...c, status: 'generating' } : c)
      );

      try {
        const variationPrompt = `${prompt} - variation ${clip.id + 1}`;
        const urls = await generateImageSequence(variationPrompt, settings);
        let audioUrl: string | null = null;

        if (narration.trim()) {
          try {
            audioUrl = await generateNarration(narration);
          } catch (narrationError: any) {
            // Log the narration error but don't stop the process.
            console.warn(`Narration failed for clip ${clip.id}, but image generation succeeded:`, narrationError.message);
          }
        }

        setClips(prevClips =>
          prevClips.map(c => c.id === clip.id ? { ...c, urls, status: 'completed', audioUrl } : c)
        );
      } catch (err: any) {
        console.error(`Error generating clip ${clip.id}:`, err.message);
        setClips(prevClips =>
          prevClips.map(c => c.id === clip.id ? { ...c, status: 'error' } : c)
        );
        setError(err.message);
        // Stop on the first image generation error to avoid cascading failures.
        break; 
      }
    }
    
    setIsGenerating(false);
  };
  
  /**
   * Resets the application to its initial state.
   * Clears the prompt and narration fields, resets all clips to 'idle',
   * clears any existing errors, and ensures the generation status is false.
   */
  const handleReset = () => {
    setPrompt('');
    setNarration('');
    setClips(Array.from({ length: 10 }, (_, i) => ({ id: i, urls: null, status: 'idle', audioUrl: null })));
    setError(null);
    setIsGenerating(false);
  };

  /**
   * Handles the downloading of all image frames for a specific clip.
   * It iterates through the array of image URLs and programmatically creates
   * and clicks a download link for each one.
   * @param urls The array of data URLs (Base64) for the images to download.
   * @param id The identifier of the clip being downloaded.
   */
  const handleDownload = async (urls: string[], id: number) => {
    if (!urls || urls.length === 0) {
        setError('No images to download for this clip.');
        return;
    }
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `ai_clip_${id + 1}_frame_${i + 1}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch(e) {
            console.error('Download failed for a frame', e);
            setError('Could not download one of the image frames.');
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            AI Clip Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400">Turn one prompt into 10 unique, animated clips.</p>
        </header>

        <main className="w-full">
            <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 mb-8 space-y-6">
                <div className="space-y-4">
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A majestic cybernetic lion roaming a neon-drenched alien jungle."
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 disabled:opacity-50"
                        rows={3}
                        disabled={isGenerating}
                    />
                    <textarea
                        id="narration"
                        value={narration}
                        onChange={(e) => setNarration(e.target.value)}
                        placeholder="Narration Script (Optional): Add a voiceover for your clips."
                        className="w-full p-3 bg-gray-800 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 disabled:opacity-50"
                        rows={2}
                        disabled={isGenerating}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-semibold mb-2 block text-cyan-300">Aspect Ratio</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {(['16:9', '9:16', '1:1', '4:3', '3:4'] as AspectRatio[]).map(ratio => (
                                <button key={ratio} onClick={() => setSettings(s => ({...s, aspectRatio: ratio}))} disabled={isGenerating} className={`flex-grow basis-16 py-2 px-1 text-xs sm:text-sm rounded-md transition-colors ${settings.aspectRatio === ratio ? 'bg-cyan-500 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex items-end gap-2 md:col-span-2">
                        <button
                            onClick={handleGenerateClick}
                            disabled={isGenerating || !prompt}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:scale-100"
                            >
                            <FilmIcon />
                            Generate
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex items-center justify-center gap-2 p-3 font-semibold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
                            disabled={isGenerating}
                            >
                            <RefreshIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {clips.map((clip) => (
                    <ClipDisplay key={clip.id} clip={clip} onDownload={handleDownload} />
                ))}
            </div>
        </main>
        
        {error && (
          <div 
             onClick={() => setError(null)}
             className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-800 text-white py-3 px-6 rounded-lg shadow-2xl border border-red-600 cursor-pointer hover:bg-red-700 transition-colors"
             title="Click to dismiss"
          >
            <p><span className="font-bold">Error:</span> {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
