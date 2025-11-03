import React, { useState } from 'react';
import { generateImageSequence } from '../services/geminiService';
import { AspectRatio, ImageSettings } from '../types';
import { PhotoIcon, DownloadIcon } from './IconComponents';
import { VISION_TEMPLATES, getCategories } from '../utils/templates';

const ASPECT_RATIOS: AspectRatio[] = ['16:9', '1:1', '9:16', '4:3', '3:4'];

interface ImagePlaygroundProps {
  onClose: () => void;
}

const ImagePlayground: React.FC<ImagePlaygroundProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState<ImageSettings>({ aspectRatio: '16:9' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setImages([]);

    try {
      const urls = await generateImageSequence(prompt, settings);
      setImages(urls);
    } catch (err: any) {
      setError(err.message || 'Failed to generate images');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    setImages([]);
  };

  const handleDownloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `VultraDrop_Image_${Date.now()}_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    images.forEach((url, index) => {
      setTimeout(() => handleDownloadImage(url, index), index * 500);
    });
  };

  const categories = ['all', ...getCategories()];
  const filteredTemplates = selectedCategory === 'all'
    ? VISION_TEMPLATES
    : VISION_TEMPLATES.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in-fast overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-start mb-6">
        <div className="animate-slide-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-orbitron text-[var(--theme-text-title)] mb-2 flex items-center gap-3">
            <PhotoIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            Image Playground
          </h1>
          <p className="text-sm sm:text-base text-[var(--theme-text-subtitle)]">
            Generate stunning AI images from your imagination
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[var(--theme-bg-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)]"
          title="Close Image Playground"
          aria-label="Close image playground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Prompt Input */}
          <div>
            <h2 className="text-xl font-orbitron font-bold text-[var(--theme-text-title)] mb-4">
              Your Prompt
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create..."
              className="w-full h-32 p-4 rounded-lg border border-[var(--theme-border-color)] bg-[var(--theme-bg-secondary)] text-[var(--theme-text-light)] placeholder-[var(--theme-text-subtitle)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)] resize-none custom-scrollbar"
              maxLength={1000}
            />
            <div className="mt-2 text-sm text-[var(--theme-text-subtitle)] text-right">
              {prompt.length} / 1000 characters
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <h2 className="text-xl font-orbitron font-bold text-[var(--theme-text-title)] mb-4">
              Aspect Ratio
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setSettings({ ...settings, aspectRatio: ratio })}
                  className={`py-3 px-4 rounded-lg border-2 font-bold transition-all ${
                    settings.aspectRatio === ratio
                      ? 'border-[var(--theme-accent1)] bg-[var(--theme-bg-secondary)] text-[var(--theme-accent1)]'
                      : 'border-[var(--theme-border-color)] bg-[var(--theme-bg-tertiary)] hover:border-[var(--theme-accent2)]'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-[var(--theme-accent1)] to-[var(--theme-accent2)] text-white hover:shadow-[0_0_30px_var(--theme-glow-heavy)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PhotoIcon className="w-6 h-6" />
                Generate Images
              </>
            )}
          </button>

          {/* Download All Button */}
          {images.length > 0 && (
            <button
              onClick={handleDownloadAll}
              className="w-full py-3 px-6 rounded-lg font-bold border-2 border-[var(--theme-accent1)] text-[var(--theme-accent1)] hover:bg-[var(--theme-accent1)] hover:text-white transition-all flex items-center justify-center gap-3"
            >
              <DownloadIcon className="w-5 h-5" />
              Download All ({images.length})
            </button>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-200">
              <p className="font-bold mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Template Categories */}
          <div>
            <h2 className="text-xl font-orbitron font-bold text-[var(--theme-text-title)] mb-4">
              Templates
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--theme-accent1)] text-white'
                      : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-subtitle)] hover:bg-[var(--theme-bg-hover)]'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {filteredTemplates.slice(0, 8).map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.prompt)}
                  className="w-full p-3 rounded-lg border border-[var(--theme-border-color)] bg-[var(--theme-bg-tertiary)] hover:border-[var(--theme-accent1)] transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{template.icon}</span>
                    <span className="font-bold text-sm text-[var(--theme-text-title)]">{template.title}</span>
                  </div>
                  <p className="text-xs text-[var(--theme-text-subtitle)]">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Images */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-orbitron font-bold text-[var(--theme-text-title)] mb-4">
            Generated Images
          </h2>
          
          {isGenerating && (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-[var(--theme-border-color)] rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[var(--theme-accent1)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-[var(--theme-text-subtitle)]">Creating your images...</p>
              </div>
            </div>
          )}

          {!isGenerating && images.length === 0 && !error && (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-[var(--theme-border-color)] rounded-lg">
              <div className="text-center">
                <PhotoIcon className="w-16 h-16 mx-auto mb-4 text-[var(--theme-text-subtitle)]" />
                <p className="text-[var(--theme-text-subtitle)]">Your generated images will appear here</p>
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border-2 border-[var(--theme-border-color)] hover:border-[var(--theme-accent1)] transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      onClick={() => window.open(url, '_blank')}
                      className="p-3 rounded-full bg-[var(--theme-accent1)] text-white hover:bg-[var(--theme-accent2)] transition-colors"
                      title="View full size"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDownloadImage(url, index)}
                      className="p-3 rounded-full bg-[var(--theme-accent1)] text-white hover:bg-[var(--theme-accent2)] transition-colors"
                      title="Download image"
                    >
                      <DownloadIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-sm font-bold">Image {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePlayground;
