import React, { useState, useEffect, useRef } from 'react';
import { DownloadIcon, SpeakerWaveIcon } from './IconComponents';
import { Clip } from '../types';

interface ClipDisplayProps {
  clip: Clip;
  onDownload: (urls: string[], id: number) => void;
}

const ClipDisplay: React.FC<ClipDisplayProps> = ({ clip, onDownload }) => {
  const { status, urls, id, audioUrl } = clip;
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (status === 'completed' && urls && urls.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % urls.length);
      }, 700); // Animation speed
      return () => clearInterval(interval);
    }
  }, [status, urls]);

  const handlePlayAudio = () => {
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-cyan-400"></div>
            <p className="text-xs text-gray-400 mt-2">Generating...</p>
          </div>
        );
      case 'completed':
        if (urls && urls.length > 0) {
          return (
            <div className="relative w-full h-full group">
               {urls.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt={`Generated clip ${id} frame ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={() => onDownload(urls, id)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                        >
                        <DownloadIcon className="w-5 h-5" />
                        Download Frames
                    </button>
                    {audioUrl && (
                        <>
                            <button
                                onClick={handlePlayAudio}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                <SpeakerWaveIcon className="w-5 h-5" />
                                Play Narration
                            </button>
                            <audio ref={audioRef} src={audioUrl} preload="auto" className="hidden"></audio>
                        </>
                    )}
                </div>
              </div>
            </div>
          );
        }
        return <p className="flex items-center justify-center h-full text-gray-400">Error: URLs missing.</p>;
      case 'error':
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-2">
                <p className="text-red-400 text-sm font-semibold">Generation Failed</p>
                <p className="text-xs text-gray-500 mt-1">Please try again.</p>
            </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">Waiting...</p>
          </div>
        );
    }
  };

  return (
    <div className="aspect-video bg-gray-800/50 rounded-lg shadow-lg overflow-hidden border-2 border-gray-700">
      {renderContent()}
    </div>
  );
};

export default ClipDisplay;
