import React, { useState, useEffect } from 'react';

const showcaseImages = [
    { src: '/assets/showcase/IMG_3753.jpeg', alt: 'VultraDrop Rendering Scene 1' },
    { src: '/assets/showcase/IMG_3754.jpeg', alt: 'VultraDrop Rendering Scene 2' },
    { src: '/assets/showcase/IMG_3755.jpeg', alt: 'VultraDrop Rendering Scene 3' },
    { src: '/assets/showcase/IMG_3756.jpeg', alt: 'VultraDrop Rendering Scene 4' },
    { src: '/assets/showcase/IMG_3757.jpeg', alt: 'VultraDrop Rendering Scene 5' },
    { src: '/assets/showcase/IMG_3758.jpeg', alt: 'VultraDrop Rendering Scene 6' },
    { src: '/assets/showcase/IMG_3759.jpeg', alt: 'VultraDrop Rendering Scene 7' },
    { src: '/assets/showcase/IMG_3760.jpeg', alt: 'VultraDrop Rendering Scene 8' },
    { src: '/assets/showcase/IMG_3761.jpeg', alt: 'VultraDrop Rendering Scene 9' },
];

interface ShowcaseGalleryProps {
    onClose: () => void;
}

const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({ onClose }) => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedImage !== null) {
                    setSelectedImage(null);
                } else {
                    onClose();
                }
            } else if (selectedImage !== null) {
                if (e.key === 'ArrowRight') {
                    setSelectedImage((selectedImage + 1) % showcaseImages.length);
                } else if (e.key === 'ArrowLeft') {
                    setSelectedImage((selectedImage - 1 + showcaseImages.length) % showcaseImages.length);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, onClose]);

    return (
        <div className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto custom-scrollbar">
            <header className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-orbitron text-[var(--theme-text-title)] mb-2">
                        Showcase Gallery
                    </h1>
                    <p className="text-sm sm:text-base text-[var(--theme-text-subtitle)]">
                        Witness the power of VultraDrop's manifestation engine
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-[var(--theme-bg-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)]"
                    title="Close Gallery"
                    aria-label="Close showcase gallery"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </header>

            <main className="flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {showcaseImages.map((image, index) => (
                        <div
                            key={index}
                            className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-[var(--theme-border-color)] hover:border-[var(--theme-accent1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_var(--theme-glow-light)]"
                            onClick={() => setSelectedImage(index)}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-64 object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm">{image.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Lightbox */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 z-30 bg-black/95 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Close lightbox"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage((selectedImage - 1 + showcaseImages.length) % showcaseImages.length);
                        }}
                        className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage((selectedImage + 1) % showcaseImages.length);
                        }}
                        className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <img
                        src={showcaseImages[selectedImage].src}
                        alt={showcaseImages[selectedImage].alt}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-white text-sm">
                        {selectedImage + 1} / {showcaseImages.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowcaseGallery;
