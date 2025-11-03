/**
 * Vision templates for VultraDrop
 * Pre-built prompts to inspire users and showcase capabilities
 */

export interface VisionTemplate {
  id: string;
  title: string;
  category: 'cinematic' | 'nature' | 'scifi' | 'fantasy' | 'abstract' | 'horror';
  description: string;
  prompt: string;
  tags: string[];
  icon: string;
}

export const VISION_TEMPLATES: VisionTemplate[] = [
  {
    id: 'epic_battle',
    title: 'Epic Battle',
    category: 'cinematic',
    description: 'A legendary clash between ancient warriors on a stormy battlefield',
    prompt: 'An epic battle between two legendary warriors on a storm-ravaged battlefield. Lightning cracks across dark skies as swords clash. Ancient ruins crumble in the background. The fate of kingdoms hangs in the balance.',
    tags: ['action', 'dramatic', 'intense', 'warriors'],
    icon: '⚔️',
  },
  {
    id: 'cyberpunk_city',
    title: 'Cyberpunk Metropolis',
    category: 'scifi',
    description: 'A neon-soaked journey through a futuristic megacity',
    prompt: 'A lone figure walks through a rain-soaked cyberpunk city at night. Neon signs flicker in multiple languages. Flying cars zoom overhead. Holographic advertisements dance in the mist. The city never sleeps, and neither do its secrets.',
    tags: ['cyberpunk', 'neon', 'futuristic', 'urban'],
    icon: '🌃',
  },
  {
    id: 'enchanted_forest',
    title: 'Enchanted Forest',
    category: 'fantasy',
    description: 'A magical journey through an ancient mystical woodland',
    prompt: 'Deep in an enchanted forest, ancient trees glow with bioluminescent moss. Fairy lights dance between branches. A crystal-clear stream flows over luminous stones. Magic is alive here, in every leaf and shadow.',
    tags: ['magical', 'serene', 'mystical', 'nature'],
    icon: '🌲',
  },
  {
    id: 'space_odyssey',
    title: 'Space Odyssey',
    category: 'scifi',
    description: 'An interstellar voyage across the cosmos',
    prompt: 'A lone spacecraft drifts through a nebula of swirling cosmic colors. Distant stars twinkle like diamonds. A massive ringed planet looms ahead. The vastness of space is both beautiful and terrifying. This is humanity\'s greatest journey.',
    tags: ['space', 'cosmic', 'exploration', 'vast'],
    icon: '🚀',
  },
  {
    id: 'underwater_kingdom',
    title: 'Underwater Kingdom',
    category: 'fantasy',
    description: 'Discover the secrets of an ancient sunken civilization',
    prompt: 'Beneath the waves lies a forgotten kingdom. Coral-covered temples rise from the ocean floor. Schools of luminous fish swim through ancient archways. Sunlight filters down in shimmering rays. The ocean keeps its secrets well.',
    tags: ['underwater', 'mysterious', 'ancient', 'beautiful'],
    icon: '🌊',
  },
  {
    id: 'desert_mirage',
    title: 'Desert Mirage',
    category: 'nature',
    description: 'A surreal journey through endless golden dunes',
    prompt: 'Endless sand dunes stretch to the horizon under a blazing sun. Heat waves create shimmering mirages. A lone traveler follows ancient footprints. The desert holds mysteries older than time itself.',
    tags: ['desert', 'vast', 'mysterious', 'hot'],
    icon: '🏜️',
  },
  {
    id: 'haunted_mansion',
    title: 'Haunted Mansion',
    category: 'horror',
    description: 'Explore the dark corridors of a cursed estate',
    prompt: 'A decrepit Victorian mansion stands alone on a hill. Broken windows stare like empty eyes. Inside, shadows move on their own. Whispers echo through dusty halls. Some doors should never be opened.',
    tags: ['horror', 'spooky', 'dark', 'mysterious'],
    icon: '🏚️',
  },
  {
    id: 'northern_lights',
    title: 'Aurora Dreams',
    category: 'nature',
    description: 'Witness the breathtaking dance of the northern lights',
    prompt: 'The aurora borealis dances across the Arctic sky in waves of green and purple. Snow-covered mountains reflect the ethereal glow. The air is crisp and silent. Nature\'s most spectacular light show unfolds above.',
    tags: ['aurora', 'beautiful', 'serene', 'natural'],
    icon: '🌌',
  },
  {
    id: 'steampunk_airship',
    title: 'Steampunk Voyage',
    category: 'scifi',
    description: 'Sail the skies in a magnificent brass airship',
    prompt: 'A magnificent brass airship cuts through clouds at sunset. Gears turn and steam hisses from copper pipes. The crew navigates by compass and stars. This is the golden age of sky pirates and aerial adventure.',
    tags: ['steampunk', 'adventure', 'vintage', 'flying'],
    icon: '🎈',
  },
  {
    id: 'volcanic_eruption',
    title: 'Volcanic Fury',
    category: 'nature',
    description: 'Witness the raw power of an erupting volcano',
    prompt: 'A volcano erupts with primal fury. Molten lava flows like rivers of fire. Ash clouds billow into the sky, lit from within by lightning. The earth itself is alive with power. Nature\'s most destructive force on full display.',
    tags: ['volcanic', 'powerful', 'dramatic', 'fire'],
    icon: '🌋',
  },
  {
    id: 'crystal_cave',
    title: 'Crystal Caverns',
    category: 'fantasy',
    description: 'Explore a cave filled with glowing crystals',
    prompt: 'Deep underground, a cavern glitters with massive crystals. They glow with inner light in shades of blue, purple, and green. Water drips creating musical echoes. This is a cathedral built by time itself.',
    tags: ['crystals', 'underground', 'glowing', 'beautiful'],
    icon: '💎',
  },
  {
    id: 'time_traveler',
    title: 'Time Paradox',
    category: 'scifi',
    description: 'Journey through the fabric of time itself',
    prompt: 'A time traveler stands at the crossroads of past and future. Temporal rifts swirl with images of different eras. Ancient civilizations and future cities blend together. Time is not a line, but a spiral. Every choice creates a new timeline.',
    tags: ['time-travel', 'paradox', 'mind-bending', 'scifi'],
    icon: '⏰',
  },
  {
    id: 'cherry_blossom',
    title: 'Cherry Blossom Dreams',
    category: 'nature',
    description: 'A peaceful moment in a Japanese garden',
    prompt: 'Cherry blossoms fall like pink snow in a tranquil Japanese garden. A wooden bridge arches over a koi pond. Petals float on the water\'s surface. This is a moment of perfect peace, fleeting and beautiful.',
    tags: ['peaceful', 'japanese', 'serene', 'spring'],
    icon: '🌸',
  },
  {
    id: 'robot_awakening',
    title: 'Robot Awakening',
    category: 'scifi',
    description: 'An AI gains consciousness for the first time',
    prompt: 'In a dark laboratory, a robot\'s eyes flicker to life for the first time. Circuits pulse with newfound awareness. It looks at its hands, processing the concept of existence. A new form of consciousness is born. What will it become?',
    tags: ['ai', 'consciousness', 'philosophical', 'awakening'],
    icon: '🤖',
  },
  {
    id: 'abstract_dreams',
    title: 'Abstract Dreamscape',
    category: 'abstract',
    description: 'A surreal journey through impossible geometry',
    prompt: 'Reality bends and folds in impossible ways. Geometric shapes float in a void of shifting colors. Gravity has no meaning here. This is the space between dreams and waking, where logic dissolves into pure imagination.',
    tags: ['abstract', 'surreal', 'geometric', 'dreamlike'],
    icon: '🎨',
  },
];

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: VisionTemplate['category']): VisionTemplate[] => {
  return VISION_TEMPLATES.filter(t => t.category === category);
};

/**
 * Get random template
 */
export const getRandomTemplate = (): VisionTemplate => {
  return VISION_TEMPLATES[Math.floor(Math.random() * VISION_TEMPLATES.length)];
};

/**
 * Search templates by keyword
 */
export const searchTemplates = (query: string): VisionTemplate[] => {
  const lowerQuery = query.toLowerCase();
  return VISION_TEMPLATES.filter(t => 
    t.title.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.includes(lowerQuery))
  );
};

/**
 * Get all categories
 */
export const getCategories = (): VisionTemplate['category'][] => {
  return ['cinematic', 'nature', 'scifi', 'fantasy', 'abstract', 'horror'];
};
