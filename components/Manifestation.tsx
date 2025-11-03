import React, { useEffect, useState } from 'react';

export const useFakeManifest = () => {
  const [isManifesting, setIsManifesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let timer: number | null = null;
    if (isManifesting) {
      setProgress(0);
      setMessage('Initializing creative core...');
      let start = Date.now();
      timer = window.setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, Math.floor((elapsed / 4000) * 100));
        setProgress(pct);
        if (pct === 25) setMessage('Composing narrative...');
        if (pct === 50) setMessage('Generating visuals...');
        if (pct === 75) setMessage('Synthesizing voice and music...');
        if (pct >= 100) {
          setMessage('Finalizing concept trailer...');
          setTimeout(() => {
            setIsManifesting(false);
            setProgress(100);
            setMessage('Complete');
          }, 600);
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }
      }, 250);
    }
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [isManifesting]);

  const startManifest = () => {
    if (isManifesting) return;
    setIsManifesting(true);
    setProgress(0);
  };

  return { isManifesting, progress, message, startManifest, cancel: () => setIsManifesting(false) };
};

export const ManifestOverlay: React.FC<{ progress: number; message: string; visible: boolean; onClose: () => void }> = ({ progress, message, visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center">
      <div className="w-[720px] max-w-[95%] bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-cyan-200/20">
        <h3 className="font-orbitron text-2xl text-slate-800 mb-3">Manifesting your vision</h3>
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-4">
          <div style={{ width: `${progress}%` }} className="h-3 bg-gradient-to-r from-cyan-300 to-pink-300" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">{progress}%</span>
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">Close</button>
        </div>
      </div>
    </div>
  );
};

export default useFakeManifest;
