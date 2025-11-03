import React, { useState } from 'react';
import GenesisDemo from './components/GenesisDemo';
import LiveSystem from './components/LiveSystem';

const App: React.FC = () => {
  const [demoCompleted, setDemoCompleted] = useState(false);

  // For development, you can skip the demo by setting this to true
  // useState(true);

  if (!demoCompleted) {
    return <GenesisDemo onComplete={() => setDemoCompleted(true)} />;
  }

  return <LiveSystem />;
};

export default App;