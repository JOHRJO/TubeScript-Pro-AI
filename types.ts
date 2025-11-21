export enum TemplateType {
  KDP = 'KDP (Livre & Trailer)',
  AFFILIATE = 'Marketing d\'Affiliation',
  TUTORIAL = 'Tutoriel / Éducatif',
  GENERAL = 'Vlog / Général'
}

export interface ScriptSection {
  title: string;
  content: string;
  visualCue?: string; // Description visuelle pour le montage
  duration?: string; // Estimation de la durée
}

export interface GeneratedScript {
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

export interface GenerationRequest {
  topic: string;
  template: TemplateType;
  language: string;
  targetAudience: string;
  tone: string;
  productName?: string; // Pour affiliation/KDP
}