import React, { useState, useEffect } from 'react';
import { getManifestations, deleteManifestation, toggleFavorite, SavedManifestation } from '../utils/storage';
import { FilmIcon, DownloadIcon } from './IconComponents';

interface ManifestationHistoryProps {
  onClose: () => void;
  onLoad: (manifestation: SavedManifestation) => void;
}

const ManifestationHistory: React.FC<ManifestationHistoryProps> = ({ onClose, onLoad }) => {
  const [manifestations, setManifestations] = useState<SavedManifestation[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadManifestations();
  }, []);

  const loadManifestations = () => {
    const saved = getManifestations();
    setManifestations(saved);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this manifestation?')) {
      deleteManifestation(id);
      loadManifestations();
    }
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    loadManifestations();
  };

  const handleLoad = (saved: SavedManifestation) => {
    onLoad(saved);
    onClose();
  };

  const filteredManifestations = manifestations
    .filter(m => filter === 'all' || m.isFavorite)
    .filter(m => 
      searchQuery === '' || 
      m.manifestation.vision.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in-fast overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-start mb-6">
        <div className="animate-slide-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-orbitron text-[var(--theme-text-title)] mb-2 flex items-center gap-3">
            <FilmIcon className="w-8 h-8 sm:w-10 sm:h-10" />
            Manifestation History
          </h1>
          <p className="text-sm sm:text-base text-[var(--theme-text-subtitle)]">
            Revisit your past creations and continue your journey
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[var(--theme-bg-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)]"
          title="Close History"
          aria-label="Close manifestation history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search manifestations..."
            className="w-full p-3 rounded-lg border border-[var(--theme-border-color)] bg-[var(--theme-bg-secondary)] text-[var(--theme-text-light)] placeholder-[var(--theme-text-subtitle)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)]"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`py-2 px-6 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[var(--theme-accent1)] text-white'
                : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-subtitle)] hover:bg-[var(--theme-bg-hover)]'
            }`}
          >
            All ({manifestations.length})
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={`py-2 px-6 rounded-lg font-semibold transition-all ${
              filter === 'favorites'
                ? 'bg-[var(--theme-accent1)] text-white'
                : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-subtitle)] hover:bg-[var(--theme-bg-hover)]'
            }`}
          >
            ⭐ Favorites ({manifestations.filter(m => m.isFavorite).length})
          </button>
        </div>
      </div>

      {/* Manifestations Grid */}
      {filteredManifestations.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FilmIcon className="w-16 h-16 mx-auto mb-4 text-[var(--theme-text-subtitle)]" />
            <p className="text-xl text-[var(--theme-text-subtitle)] mb-2">
              {searchQuery ? 'No manifestations found' : 'No manifestations yet'}
            </p>
            <p className="text-sm text-[var(--theme-text-subtitle)]">
              {searchQuery ? 'Try a different search term' : 'Create your first manifestation to see it here'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredManifestations.map((saved) => {
            const completedClips = saved.manifestation.clips.filter(c => c.status === 'completed').length;
            const totalClips = saved.manifestation.clips.length;
            
            return (
              <div
                key={saved.id}
                className="group relative rounded-lg border-2 border-[var(--theme-border-color)] bg-[var(--theme-bg-secondary)] hover:border-[var(--theme-accent1)] transition-all overflow-hidden animate-fade-in"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[var(--theme-bg-tertiary)] overflow-hidden">
                  {saved.thumbnail ? (
                    <img
                      src={saved.thumbnail}
                      alt="Manifestation thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FilmIcon className="w-12 h-12 text-[var(--theme-text-subtitle)]" />
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(saved.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                    title={saved.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <span className="text-xl">
                      {saved.isFavorite ? '⭐' : '☆'}
                    </span>
                  </button>

                  {/* Progress Badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/80 text-xs font-bold text-white">
                    {completedClips}/{totalClips} scenes
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-sm text-[var(--theme-text-light)] mb-2 line-clamp-2">
                    {saved.manifestation.vision}
                  </p>
                  <p className="text-xs text-[var(--theme-text-subtitle)] mb-4">
                    {formatDate(saved.timestamp)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoad(saved)}
                      className="flex-1 py-2 px-4 rounded-lg bg-[var(--theme-accent1)] text-white hover:bg-[var(--theme-accent2)] transition-colors text-sm font-bold"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(saved.id)}
                      className="p-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManifestationHistory;
