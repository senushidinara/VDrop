import React from 'react';
import { useTheme, Theme } from '../contexts/ThemeContext';

const themes: { name: Theme, label: string }[] = [
    { name: 'nebula', label: 'Nebula' },
    { name: 'cyberpunk', label: 'Cyberpunk' },
    { name: 'biosynth', label: 'Biosynth' },
    { name: 'starlight', label: 'Starlight' },
];

export const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center bg-[var(--theme-bg-secondary)] rounded-full p-1 shadow-inner">
            {themes.map(t => (
                <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                        theme === t.name ? 'bg-[var(--theme-accent1)] text-white' : 'text-[var(--theme-text-light)] hover:bg-[var(--theme-bg-hover)]'
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};
