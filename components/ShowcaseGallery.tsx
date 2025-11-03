import React, { useState } from 'react';

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

    const handleKeyDown = (e: React.KeyboardEvent) => {
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

    return (
        <div 
            className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in overflow-y-auto"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {showcaseImages.map((image, index) => (
                        <div
                            key={index}
                            className="group relative aspect-video bg-black/50 rounded-lg overflow-hidden border-2 border-[var(--theme-border-color)] hover:border-[var(--theme-accent1)] transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--theme-glow-light)] cursor-pointer transform hover:scale-105"
                            onClick={() => setSelectedImage(index)}
                            role="button"
                            tabIndex={0}
                            aria-label={`View ${image.alt} in fullscreen`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedImage(index);
                                }
                            }}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm font-semibold">Scene {index + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Lightbox Modal */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
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

                    {/* Previous Button */}
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

                    {/* Image */}
                    <div className="max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={showcaseImages[selectedImage].src}
                            alt={showcaseImages[selectedImage].alt}
                            className="w-full h-full object-contain rounded-lg"
                        />
                        <p className="text-white text-center mt-4 text-lg">
                            Scene {selectedImage + 1} of {showcaseImages.length}
                        </p>
                    </div>

                    {/* Next Button */}
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
                </div>
            )}
        </div>
    );
};

export default ShowcaseGallery;
