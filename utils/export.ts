/**
 * Export utilities for VultraDrop
 * Handles downloading assets, creating archives, and sharing
 */

import { Manifestation, Clip } from '../types';
import JSZip from 'jszip';

/**
 * Download a single file from a URL
 */
export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error(`Failed to download ${filename}`);
  }
};

/**
 * Download all assets from a clip
 */
export const downloadClipAssets = async (clip: Clip, clipIndex: number): Promise<void> => {
  const downloads: Promise<void>[] = [];
  
  // Download images
  if (clip.urls) {
    clip.urls.forEach((url, frameIndex) => {
      downloads.push(
        downloadFile(url, `VultraDrop_Clip${clipIndex + 1}_Frame${frameIndex + 1}.png`)
      );
    });
  }
  
  // Download narration
  if (clip.narrationUrl) {
    downloads.push(
      downloadFile(clip.narrationUrl, `VultraDrop_Clip${clipIndex + 1}_Narration.mp3`)
    );
  }
  
  await Promise.all(downloads);
};

/**
 * Create a ZIP archive of all manifestation assets
 * Note: This is a placeholder - JSZip would need to be installed
 */
export const downloadManifestationArchive = async (manifestation: Manifestation): Promise<void> => {
  try {
    // For now, download files individually
    // In a real implementation, you'd use JSZip to create an archive
    
    const downloads: Promise<void>[] = [];
    
    // Download music
    if (manifestation.musicUrl) {
      downloads.push(downloadFile(manifestation.musicUrl, 'VultraDrop_Music.mp3'));
    }
    
    // Download all clips
    for (let i = 0; i < manifestation.clips.length; i++) {
      const clip = manifestation.clips[i];
      if (clip.status === 'completed') {
        if (clip.urls) {
          clip.urls.forEach((url, frameIndex) => {
            downloads.push(
              downloadFile(url, `VultraDrop_Scene${i + 1}_Frame${frameIndex + 1}.png`)
            );
          });
        }
        if (clip.narrationUrl) {
          downloads.push(
            downloadFile(clip.narrationUrl, `VultraDrop_Scene${i + 1}_Narration.mp3`)
          );
        }
      }
    }
    
    await Promise.all(downloads);
  } catch (error) {
    console.error('Error creating archive:', error);
    throw new Error('Failed to download manifestation archive');
  }
};

/**
 * Export manifestation as JSON
 */
export const exportManifestationJSON = (manifestation: Manifestation): void => {
  const json = JSON.stringify(manifestation, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `VultraDrop_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Create a shareable link (placeholder - would need backend)
 */
export const createShareableLink = async (manifestation: Manifestation): Promise<string> => {
  // In a real implementation, this would upload to a backend and return a short URL
  // For now, we'll create a data URL (not practical for real use)
  const data = btoa(JSON.stringify({
    vision: manifestation.vision,
    timestamp: Date.now(),
  }));
  
  return `${window.location.origin}?share=${data}`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

/**
 * Generate a thumbnail from the first clip
 */
export const generateThumbnail = (manifestation: Manifestation): string | null => {
  const firstClip = manifestation.clips.find(c => c.status === 'completed' && c.urls);
  return firstClip?.urls?.[0] || null;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Download script as text file
 */
export const downloadScript = (manifestation: Manifestation): void => {
  const scriptText = manifestation.clips
    .map((clip, index) => `Scene ${index + 1}:\n${clip.scriptText}\n`)
    .join('\n');
  
  const blob = new Blob([scriptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `VultraDrop_Script_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
