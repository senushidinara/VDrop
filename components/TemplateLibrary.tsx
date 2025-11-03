import React, { useState } from 'react';
import { VISION_TEMPLATES, getCategories, VisionTemplate } from '../utils/templates';

interface TemplateLibraryProps {
  onClose: () => void;
  onSelect: (prompt: string) => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onClose, onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<VisionTemplate | null>(null);

  const categories = ['all', ...getCategories()];
  
  const filteredTemplates = VISION_TEMPLATES
    .filter(t => selectedCategory === 'all' || t.category === selectedCategory)
    .filter(t => 
      searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleSelectTemplate = (template: VisionTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.prompt);
      onClose();
    }
  };

  const getCategoryColor = (category: VisionTemplate['category']) => {
    const colors = {
      cinematic: 'from-red-500 to-orange-500',
      nature: 'from-green-500 to-emerald-500',
      scifi: 'from-blue-500 to-cyan-500',
      fantasy: 'from-purple-500 to-pink-500',
      abstract: 'from-yellow-500 to-amber-500',
      horror: 'from-gray-700 to-gray-900',
    };
    return colors[category];
  };

  return (
    <div className="fixed inset-0 z-20 bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] font-sans flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in-fast overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-start mb-6">
        <div className="animate-slide-up">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-orbitron text-[var(--theme-text-title)] mb-2 flex items-center gap-3">
            <span className="text-3xl">📚</span>
            Template Library
          </h1>
          <p className="text-sm sm:text-base text-[var(--theme-text-subtitle)]">
            Explore pre-crafted visions to inspire your manifestations
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[var(--theme-bg-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)]"
          title="Close Template Library"
          aria-label="Close template library"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates by name, description, or tags..."
          className="w-full p-3 rounded-lg border border-[var(--theme-border-color)] bg-[var(--theme-bg-secondary)] text-[var(--theme-text-light)] placeholder-[var(--theme-text-subtitle)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent1)]"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--theme-accent1)] text-white shadow-[0_0_15px_var(--theme-glow-light)]'
                  : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-subtitle)] hover:bg-[var(--theme-bg-hover)]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Templates List */}
        <div className="lg:col-span-2 overflow-y-auto custom-scrollbar pr-4">
          {filteredTemplates.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="text-xl text-[var(--theme-text-subtitle)]">No templates found</p>
                <p className="text-sm text-[var(--theme-text-subtitle)] mt-2">Try a different search or category</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`group relative p-6 rounded-lg border-2 transition-all text-left overflow-hidden ${
                    selectedTemplate?.id === template.id
                      ? 'border-[var(--theme-accent1)] bg-[var(--theme-bg-secondary)] shadow-[0_0_20px_var(--theme-glow-light)]'
                      : 'border-[var(--theme-border-color)] bg-[var(--theme-bg-tertiary)] hover:border-[var(--theme-accent2)]'
                  }`}
                >
                  {/* Category Badge */}
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg bg-gradient-to-r ${getCategoryColor(template.category)} text-white text-xs font-bold`}>
                    {template.category}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-3">{template.icon}</div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[var(--theme-text-title)] mb-2">
                    {template.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[var(--theme-text-subtitle)] mb-3">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-[var(--theme-bg-primary)] text-xs text-[var(--theme-text-subtitle)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Selection Indicator */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute bottom-2 right-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--theme-accent1)] flex items-center justify-center text-white">
                        ✓
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1 border-2 border-[var(--theme-border-color)] rounded-lg p-6 bg-[var(--theme-bg-secondary)] overflow-y-auto custom-scrollbar">
          {selectedTemplate ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedTemplate.icon}</div>
                <h2 className="text-2xl font-bold font-orbitron text-[var(--theme-text-title)] mb-2">
                  {selectedTemplate.title}
                </h2>
                <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(selectedTemplate.category)} text-white text-sm font-bold mb-4`}>
                  {selectedTemplate.category}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-[var(--theme-text-subtitle)] uppercase mb-2">
                  Description
                </h3>
                <p className="text-[var(--theme-text-light)]">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Full Prompt */}
              <div>
                <h3 className="text-sm font-bold text-[var(--theme-text-subtitle)] uppercase mb-2">
                  Full Prompt
                </h3>
                <div className="p-4 rounded-lg bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-color)]">
                  <p className="text-sm text-[var(--theme-text-light)] leading-relaxed">
                    {selectedTemplate.prompt}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-bold text-[var(--theme-text-subtitle)] uppercase mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-color)] text-sm text-[var(--theme-text-light)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Use Button */}
              <button
                onClick={handleUseTemplate}
                className="w-full py-4 px-6 rounded-lg font-bold text-lg bg-gradient-to-r from-[var(--theme-accent1)] to-[var(--theme-accent2)] text-white hover:shadow-[0_0_30px_var(--theme-glow-heavy)] transition-all"
              >
                Use This Template
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="text-6xl mb-4 block">👈</span>
                <p className="text-[var(--theme-text-subtitle)]">
                  Select a template to preview
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;
