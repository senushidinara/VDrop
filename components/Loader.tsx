import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <p className="mt-4 text-lg text-white">
        Generating your image sequences...
      </p>
    </div>
  );
};

export default Loader;
