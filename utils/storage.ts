/**
 * LocalStorage utility functions for VultraDrop
 * Handles saving/loading manifestations, settings, and user preferences
 */

import { Manifestation } from '../types';

const STORAGE_KEYS = {
  MANIFESTATIONS: 'vultradrop_manifestations',
  SETTINGS: 'vultradrop_settings',
  FAVORITES: 'vultradrop_favorites',
  RECENT_VISIONS: 'vultradrop_recent_visions',
} as const;

export interface SavedManifestation {
  id: string;
  timestamp: number;
  manifestation: Manifestation;
  thumbnail?: string;
  isFavorite?: boolean;
}

export interface UserSettings {
  defaultAspectRatio: string;
  autoPlay: boolean;
  musicVolume: number;
  narrationVolume: number;
  theme: string;
  imageQuality: 'standard' | 'hd';
}

const DEFAULT_SETTINGS: UserSettings = {
  defaultAspectRatio: '16:9',
  autoPlay: true,
  musicVolume: 0.7,
  narrationVolume: 0.9,
  theme: 'nebula',
  imageQuality: 'standard',
};

/**
 * Save a manifestation to localStorage
 */
export const saveManifestation = (manifestation: Manifestation): string => {
  try {
    const id = `manifest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const saved: SavedManifestation = {
      id,
      timestamp: Date.now(),
      manifestation,
      thumbnail: manifestation.clips[0]?.urls?.[0] || undefined,
    };

    const existing = getManifestations();
    existing.unshift(saved);
    
    // Keep only last 50 manifestations
    const trimmed = existing.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.MANIFESTATIONS, JSON.stringify(trimmed));
    
    return id;
  } catch (error) {
    console.error('Error saving manifestation:', error);
    throw new Error('Failed to save manifestation');
  }
};

/**
 * Get all saved manifestations
 */
export const getManifestations = (): SavedManifestation[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MANIFESTATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading manifestations:', error);
    return [];
  }
};

/**
 * Get a specific manifestation by ID
 */
export const getManifestation = (id: string): SavedManifestation | null => {
  const manifestations = getManifestations();
  return manifestations.find(m => m.id === id) || null;
};

/**
 * Delete a manifestation
 */
export const deleteManifestation = (id: string): void => {
  try {
    const manifestations = getManifestations();
    const filtered = manifestations.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MANIFESTATIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting manifestation:', error);
  }
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = (id: string): void => {
  try {
    const manifestations = getManifestations();
    const updated = manifestations.map(m => 
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    );
    localStorage.setItem(STORAGE_KEYS.MANIFESTATIONS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

/**
 * Get user settings
 */
export const getSettings = (): UserSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save user settings
 */
export const saveSettings = (settings: Partial<UserSettings>): void => {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

/**
 * Save recent vision prompt
 */
export const saveRecentVision = (vision: string): void => {
  try {
    const recent = getRecentVisions();
    const updated = [vision, ...recent.filter(v => v !== vision)].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.RECENT_VISIONS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent vision:', error);
  }
};

/**
 * Get recent vision prompts
 */
export const getRecentVisions = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_VISIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading recent visions:', error);
    return [];
  }
};

/**
 * Clear all stored data
 */
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Get storage usage info
 */
export const getStorageInfo = (): { used: number; available: number; percentage: number } => {
  try {
    let used = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) used += item.length;
    });
    
    // Approximate localStorage limit (5MB in most browsers)
    const available = 5 * 1024 * 1024;
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  } catch (error) {
    return { used: 0, available: 0, percentage: 0 };
  }
};
