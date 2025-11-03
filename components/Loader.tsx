import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in" role="status" aria-live="polite">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="w-24 h-24 border-4 border-dashed rounded-full animate-spin border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)]"></div>
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-pulse shadow-[0_0_40px_rgba(6,182,212,0.8)]"></div>
        </div>
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.9)]"></div>
        </div>
      </div>
      
      <div className="mt-8 text-center animate-slide-up">
        <p className="text-xl font-orbitron text-white font-bold mb-2">
          ✨ Manifesting Your Vision ✨
        </p>
        <p className="text-sm text-cyan-200">
          The creative core is weaving your concept into reality...
        </p>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
