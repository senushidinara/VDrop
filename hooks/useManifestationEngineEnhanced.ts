import { useState, useCallback, useRef } from 'react';
import { Manifestation, Clip, ImageSettings } from '../types';
import { generateScript } from '../services/geminiService';
import { generateImageSequence } from '../services/geminiService';
import { generateNarration } from '../services/elevenLabsService';
import { generateMusic } from '../services/musicService';
import { saveManifestation, saveRecentVision } from '../utils/storage';

const SCRIPT_LENGTH = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export interface ProgressUpdate {
  stage: 'script' | 'music' | 'scenes' | 'complete';
  message: string;
  progress: number; // 0-100
  currentScene?: number;
  totalScenes?: number;
}

/**
 * Enhanced manifestation engine with retry logic, progress tracking, and history
 */
export const useManifestationEngineEnhanced = () => {
  const [manifestation, setManifestation] = useState<Manifestation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressUpdate>({
    stage: 'script',
    message: '',
    progress: 0,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Retry helper with exponential backoff
   */
  const retryWithBackoff = async <T,>(
    fn: () => Promise<T>,
    retries: number = MAX_RETRIES,
    delay: number = RETRY_DELAY
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      
      console.warn(`Retry attempt remaining: ${retries}. Waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return retryWithBackoff(fn, retries - 1, delay * 1.5);
    }
  };

  /**
   * Generate a single clip with retry logic
   */
  const generateClip = async (
    scriptText: string,
    vision: string,
    settings: ImageSettings,
    index: number
  ): Promise<{ urls: string[]; narrationUrl: string }> => {
    // Update status to 'generating'
    setManifestation(prev => {
      if (!prev) return prev;
      const newClips = [...prev.clips];
      newClips[index] = { ...newClips[index], status: 'generating' };
      return { ...prev, clips: newClips };
    });

    try {
      // Generate images and narration with retry logic
      const [imageUrls, narrationUrl] = await Promise.all([
        retryWithBackoff(() => generateImageSequence(`${vision}, ${scriptText}`, settings)),
        retryWithBackoff(() => generateNarration(scriptText)),
      ]);

      return { urls: imageUrls, narrationUrl };
    } catch (error) {
      console.error(`Failed to generate clip ${index} after retries:`, error);
      throw error;
    }
  };

  /**
   * Main manifestation function
   */
  const manifestVision = useCallback(async (vision: string, settings: ImageSettings) => {
    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();
    
    setIsGenerating(true);
    setError(null);
    setManifestation(null);
    setProgress({
      stage: 'script',
      message: 'Awakening the creative core...',
      progress: 0,
    });

    try {
      // 1. Generate Script
      setProgress({
        stage: 'script',
        message: 'Generating narrative script...',
        progress: 10,
      });
      
      const script = await retryWithBackoff(() => generateScript(vision));
      
      if (script.length !== SCRIPT_LENGTH) {
        console.warn(`Expected ${SCRIPT_LENGTH} scenes, but got ${script.length}. Using what was returned.`);
      }

      // 2. Generate Music
      setProgress({
        stage: 'music',
        message: 'Composing musical score...',
        progress: 20,
      });
      
      const musicUrl = generateMusic(vision);

      // 3. Initialize Clips State
      const initialClips: Clip[] = script.map((scriptText, index) => ({
        id: index,
        urls: null,
        status: 'idle',
        scriptText,
        narrationUrl: null,
      }));

      const initialManifestation: Manifestation = {
        vision,
        musicUrl,
        clips: initialClips,
      };
      setManifestation(initialManifestation);

      // 4. Generate clips sequentially with progress updates
      setProgress({
        stage: 'scenes',
        message: 'Manifesting scenes...',
        progress: 30,
        currentScene: 0,
        totalScenes: script.length,
      });

      for (let i = 0; i < script.length; i++) {
        // Check if aborted
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Manifestation cancelled by user');
        }

        const scriptText = script[i];
        const sceneProgress = 30 + ((i / script.length) * 60);
        
        setProgress({
          stage: 'scenes',
          message: `Manifesting scene ${i + 1} of ${script.length}...`,
          progress: sceneProgress,
          currentScene: i + 1,
          totalScenes: script.length,
        });

        try {
          const { urls, narrationUrl } = await generateClip(scriptText, vision, settings, i);
          
          // Update clip to completed
          setManifestation(prev => {
            if (!prev) return prev;
            const newClips = [...prev.clips];
            newClips[i] = {
              ...newClips[i],
              status: 'completed',
              urls,
              narrationUrl,
            };
            return { ...prev, clips: newClips };
          });
        } catch (clipError: any) {
          console.error(`Error generating clip ${i}:`, clipError);
          
          // Mark clip as error but continue with others
          setManifestation(prev => {
            if (!prev) return prev;
            const newClips = [...prev.clips];
            newClips[i] = { ...newClips[i], status: 'error' };
            return { ...prev, clips: newClips };
          });
        }
      }

      // 5. Complete
      setProgress({
        stage: 'complete',
        message: 'Manifestation complete! ✨',
        progress: 100,
      });

      // Save to history
      saveRecentVision(vision);
      
      // Save manifestation
      if (initialManifestation) {
        saveManifestation(initialManifestation);
      }

    } catch (e: any) {
      console.error('Manifestation failed:', e);
      setError(e.message || 'An unknown error occurred during manifestation.');
      setProgress({
        stage: 'script',
        message: 'Manifestation failed',
        progress: 0,
      });
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Cancel ongoing manifestation
   */
  const cancelManifestation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setError('Manifestation cancelled');
    }
  }, []);

  /**
   * Reset manifestation state
   */
  const resetManifestation = useCallback(() => {
    setManifestation(null);
    setError(null);
    setProgress({
      stage: 'script',
      message: '',
      progress: 0,
    });
  }, []);

  /**
   * Retry failed clips
   */
  const retryFailedClips = useCallback(async (settings: ImageSettings) => {
    if (!manifestation) return;

    const failedIndices = manifestation.clips
      .map((clip, index) => (clip.status === 'error' ? index : -1))
      .filter(index => index !== -1);

    if (failedIndices.length === 0) return;

    setIsGenerating(true);
    setError(null);

    for (const index of failedIndices) {
      const clip = manifestation.clips[index];
      try {
        const { urls, narrationUrl } = await generateClip(
          clip.scriptText,
          manifestation.vision,
          settings,
          index
        );

        setManifestation(prev => {
          if (!prev) return prev;
          const newClips = [...prev.clips];
          newClips[index] = {
            ...newClips[index],
            status: 'completed',
            urls,
            narrationUrl,
          };
          return { ...prev, clips: newClips };
        });
      } catch (error) {
        console.error(`Failed to retry clip ${index}:`, error);
      }
    }

    setIsGenerating(false);
  }, [manifestation]);

  return {
    manifestation,
    isGenerating,
    error,
    progress,
    manifestVision,
    cancelManifestation,
    resetManifestation,
    retryFailedClips,
  };
};
