
export enum TemplateType {
  KDP = 'KDP (Livre & Trailer)',
  AFFILIATE = 'Marketing d\'Affiliation',
  TUTORIAL = 'Tutoriel / Éducatif',
  GENERAL = 'Vlog / Général'
}

export interface ScriptSection {
  title: string;
  content: string;
  visualCue?: string;
  duration?: string;
}

export interface GeneratedScript {
  id?: string;
  timestamp?: number;
  title: string;
  sections: ScriptSection[];
  estimatedTotalDuration: string;
  tone: string;
}

export interface SeoData {
  optimizedTitles: string[];
  description: string;
  tags: string[];
  hashtags: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  script: GeneratedScript;
  seo: SeoData;
  topic: string;
}

export interface GenerationRequest {
  topic: string;
  template: TemplateType;
  language: string;
  targetAudience: string;
  tone: string;
  productName?: string;
}
