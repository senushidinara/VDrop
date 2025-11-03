import React from 'react';
import LiveSystem from './components/LiveSystem';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <LiveSystem />
        </ThemeProvider>
    );
};

export default App;
