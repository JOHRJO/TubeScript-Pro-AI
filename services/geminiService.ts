
import { GeneratedScript, SeoData, TemplateType, GenerationRequest } from "../types";

const API_BASE = '/api';

const getAuthToken = () => localStorage.getItem('ts_token');

const getSystemInstruction = (template: TemplateType): string => {
  switch (template) {
    case TemplateType.KDP:
      return "Tu es un expert en marketing de livres (KDP). Crée des scripts engageants pour des bandes-annonces de livres. JSON uniquement.";
    case TemplateType.AFFILIATE:
      return "Tu es un expert en marketing d'affiliation. Crée des scripts de revue de produits persuasifs. JSON uniquement.";
    case TemplateType.TUTORIAL:
      return "Tu es un pédagogue expert. Crée des scripts tutoriels clairs étape par étape. JSON uniquement.";
    default:
      return "Tu es un stratège YouTube expert. Crée des scripts viraux. JSON uniquement.";
  }
};

export const login = async (email: string): Promise<string> => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  localStorage.setItem('ts_token', data.token);
  return data.token;
};

export const generateScript = async (request: GenerationRequest): Promise<GeneratedScript> => {
  const token = getAuthToken();
  const prompt = `Génère un script JSON pour: "${request.topic}". Langue: ${request.language}. Type: ${request.template}. Ton: ${request.tone}. Public: ${request.targetAudience}. Structure: {title, estimatedTotalDuration, tone, sections: [{title, content, visualCue, duration}]}`;

  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      prompt,
      config: {
        systemInstruction: getSystemInstruction(request.template),
        responseMimeType: "application/json"
      }
    })
  });

  const result = await res.json();
  if (!result.success) throw new Error(result.error);

  const parsed = JSON.parse(result.data);
  return {
    title: parsed.title || "Sans titre",
    estimatedTotalDuration: parsed.estimatedTotalDuration || "N/A",
    tone: parsed.tone || request.tone,
    sections: Array.isArray(parsed.sections) ? parsed.sections : []
  };
};

export const generateSeo = async (request: GenerationRequest, scriptContext?: string): Promise<SeoData> => {
  const token = getAuthToken();
  const context = scriptContext ? `Basé sur: ${scriptContext.substring(0, 1000)}` : `Sujet: ${request.topic}`;
  const prompt = `Génère SEO JSON pour YouTube. ${context}. Langue: ${request.language}. Structure: {optimizedTitles: [], description: "", tags: [], hashtags: []}`;

  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      prompt,
      config: { responseMimeType: "application/json" }
    })
  });

  const result = await res.json();
  if (!result.success) throw new Error(result.error);

  const parsed = JSON.parse(result.data);
  return {
    optimizedTitles: Array.isArray(parsed.optimizedTitles) ? parsed.optimizedTitles : [],
    description: parsed.description || "",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : []
  };
};
