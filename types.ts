export interface VideoConfig {
  prompt: string;
  resolution: '720p' | '1080p';
  aspectRatio: '16:9' | '9:16';
  model: 'veo-3.1-fast-generate-preview' | 'veo-3.1-generate-preview';
}

export interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  config: VideoConfig;
}

export interface ScriptResponse {
  visualPrompt: string;
  explanation: string;
}

export interface AIStudioClient {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudioClient;
  }
}