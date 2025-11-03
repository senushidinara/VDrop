import { AspectRatio } from './types';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageSettings {
  aspectRatio: AspectRatio;
}

export type ClipStatus = 'idle' | 'generating' | 'completed' | 'error';

export interface Clip {
  id: number;
  urls: string[] | null;
  status: ClipStatus;
  scriptText: string; // The specific line of script for this scene
  narrationUrl: string | null; // URL for this specific scene's narration
}

// Represents the entire creative output from a single vision
export interface Manifestation {
    vision: string;
    musicUrl: string | null;
    clips: Clip[];
}
