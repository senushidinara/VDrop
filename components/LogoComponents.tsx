import React from 'react';

export const VultraDropLogo = ({ className = 'w-10 h-10' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 2.5L95.5 26.25V73.75L50 97.5L4.5 73.75V26.25L50 2.5Z" stroke="currentColor" strokeWidth="4"/>
        <path d="M50 2.5V26.25M50 97.5V73.75" stroke="currentColor" strokeWidth="2"/>
        <path d="M27.25 37.5L50 50L72.75 37.5" stroke="currentColor" strokeWidth="3"/>
        <path d="M27.25 62.5L50 75L72.75 62.5" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
        <path d="M50 50V75" stroke="currentColor" strokeWidth="2"/>
        <text x="50" y="56" fontFamily="Orbitron, sans-serif" fontSize="12" fill="currentColor" textAnchor="middle" fontWeight="900">V</text>
    </svg>
);


export const RaindropLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="url(#paint0_linear_raindrop)" />
        <path d="M12 7C11.45 7 11 7.45 11 8V12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12V8C13 7.45 12.55 7 12 7Z" fill="url(#paint1_linear_raindrop)" />
        <path d="M15.24 8.76C14.85 8.37 14.22 8.37 13.83 8.76L11.0001 11.59L9.17 9.76C8.78 9.37 8.15 9.37 7.76 9.76C7.37 10.15 7.37 10.78 7.76 11.17L10.59 14L11.0001 14.41L11.41 14L15.24 10.17C15.63 9.78 15.63 9.15 15.24 8.76Z" fill="url(#paint2_linear_raindrop)" />
        <defs>
            <linearGradient id="paint0_linear_raindrop" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06b6d4" />
                <stop offset="1" stopColor="#67e8f9" />
            </linearGradient>
            <linearGradient id="paint1_linear_raindrop" x1="11" y1="10" x2="13" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06b6d4" />
                <stop offset="1" stopColor="#67e8f9" />
            </linearGradient>
            <linearGradient id="paint2_linear_raindrop" x1="7.5" y1="11.885" x2="15.5" y2="11.885" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06b6d4" />
                <stop offset="1" stopColor="#67e8f9" />
            </linearGradient>
        </defs>
    </svg>
);


export const VultrLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="url(#paint0_linear_vultr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 7L12 12" stroke="url(#paint1_linear_vultr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V12" stroke="url(#paint2_linear_vultr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 7L12 12" stroke="url(#paint3_linear_vultr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 4.5L7 9.5" stroke="url(#paint4_linear_vultr)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="paint0_linear_vultr" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" />
                <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
             <linearGradient id="paint1_linear_vultr" x1="2" y1="9.5" x2="12" y2="9.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" />
                <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
             <linearGradient id="paint2_linear_vultr" x1="12" y1="17" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" />
                <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
             <linearGradient id="paint3_linear_vultr" x1="12" y1="9.5" x2="22" y2="9.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" />
                <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
             <linearGradient id="paint4_linear_vultr" x1="7" y1="7" x2="17" y2="7" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0ea5e9" />
                <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
        </defs>
    </svg>
);


export const ElevenLabsLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12H6" stroke="url(#paint0_linear_eleven)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 8V16" stroke="url(#paint1_linear_eleven)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 5V19" stroke="url(#paint2_linear_eleven)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8V16" stroke="url(#paint3_linear_eleven)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 12H18" stroke="url(#paint4_linear_eleven)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="paint0_linear_eleven" x1="4" y1="12" x2="6" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#d946ef" />
            </linearGradient>
            <linearGradient id="paint1_linear_eleven" x1="8" y1="12" x2="8" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#d946ef" />
            </linearGradient>
             <linearGradient id="paint2_linear_eleven" x1="12" y1="12" x2="12" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#d946ef" />
            </linearGradient>
            <linearGradient id="paint3_linear_eleven" x1="16" y1="12" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#d946ef" />
            </linearGradient>
            <linearGradient id="paint4_linear_eleven" x1="18" y1="12" x2="20" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" />
                <stop offset="1" stopColor="#d946ef" />
            </linearGradient>
        </defs>
    </svg>
);


export const GeminiCerebrasLogo = ({ className = 'w-6 h-6' }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="url(#paint0_linear_gemini)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 15L14 12L10 9" stroke="url(#paint1_linear_gemini)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="paint0_linear_gemini" x1="3" y1="12" x2="21" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f43f5e" />
                <stop offset="1" stopColor="#fda4af" />
            </linearGradient>
            <linearGradient id="paint1_linear_gemini" x1="10" y1="12" x2="14" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f43f5e" />
                <stop offset="1" stopColor="#fda4af" />
            </linearGradient>
        </defs>
    </svg>
);