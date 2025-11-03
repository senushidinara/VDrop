import React, { useState } from 'react';
import GenesisDemo from './components/GenesisDemo';
import LiveSystem from './components/LiveSystem';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
    const [showGenesis, setShowGenesis] = useState(true);

    const handleGenesisComplete = () => {
        setShowGenesis(false);
    };
    
    return (
        <ThemeProvider>
            {showGenesis ? (
                <GenesisDemo onComplete={handleGenesisComplete} />
            ) : (
                <LiveSystem />
            )}
        </ThemeProvider>
    );
};

export default App;
