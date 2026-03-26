export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'en' | 'ru';

export interface VideoItem {
  id: string;
  title: string;
  titleRu?: string;
  subtitle?: string;
  subtitleRu?: string;
  difficulty?: Difficulty;
  text: string;
  textRu?: string;
  url: string;
}

export interface VideoData {
  fullLength: VideoItem[];
  vertical: VideoItem[];
  motionGraphics: VideoItem[];
}

export type SectionType = 'About Me' | 'Full-Length Videos' | 'Vertical Videos' | 'Motion Graphics' | 'Contact Me' | 'Terminal';