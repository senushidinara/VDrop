export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageSettings {
  aspectRatio: AspectRatio;
}

export type ClipStatus = 'idle' | 'generating' | 'completed' | 'error';

export interface Clip {
  id: number;
  urls: string[] | null;
  status: ClipStatus;
  audioUrl: string | null;
}
