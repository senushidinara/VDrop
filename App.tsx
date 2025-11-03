import React, { useState } from 'react';
import GenesisDemo from './components/GenesisDemo';
import LiveSystem from './components/LiveSystem';

const App: React.FC = () => {
  const [demoCompleted, setDemoCompleted] = useState(false);

  // For development, you can skip the demo by setting this to true
  // useState(true);

  return (
    <>
      {!demoCompleted && (
        <GenesisDemo 
          onComplete={() => setDemoCompleted(true)} 
        />
      )}
      <div className={`transition-opacity duration-1000 ${demoCompleted ? 'opacity-100' : 'opacity-0'}`}>
        {demoCompleted && <LiveSystem />}
      </div>
    </>
  );
};

export default App;