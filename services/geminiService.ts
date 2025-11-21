import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedScript, SeoData, TemplateType, GenerationRequest } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate system instructions based on template
const getSystemInstruction = (template: TemplateType): string => {
  switch (template) {
    case TemplateType.KDP:
      return "Tu es un expert en marketing de livres (KDP). Crée des scripts engageants pour des bandes-annonces de livres ou des lectures d'extraits. Concentre-toi sur l'accroche émotionnelle et l'appel à l'action pour acheter.";
    case TemplateType.AFFILIATE:
      return "Tu es un expert en marketing d'affiliation. Crée des scripts de revue de produits honnêtes mais persuasifs. Mets en avant les problèmes résolus, les fonctionnalités clés, et incite au clic sur le lien en description.";
    case TemplateType.TUTORIAL:
      return "Tu es un pédagogue expert. Crée des scripts tutoriels clairs, étape par étape. Utilise un langage simple, évite le jargon inutile et assure une progression logique.";
    default:
      return "Tu es un stratège YouTube expert. Crée des scripts viraux avec une rétention d'audience élevée.";
  }
};

export const generateScript = async (request: GenerationRequest): Promise<GeneratedScript> => {
  if (!apiKey) throw new Error("API Key manquante.");

  const prompt = `
    Génère un script YouTube complet en format JSON pour le sujet : "${request.topic}".
    Type de vidéo : ${request.template}.
    Public cible : ${request.targetAudience}.
    Ton : ${request.tone}.
    Langue de sortie : ${request.language}.
    ${request.productName ? `Nom du produit/livre : ${request.productName}` : ''}

    Le JSON doit suivre exactement cette structure :
    {
      "title": "Titre suggéré pour le script",
      "estimatedTotalDuration": "ex: 5-7 minutes",
      "tone": "Ton utilisé",
      "sections": [
        {
          "title": "Nom de la section (ex: Accroche, Intro, Point 1)",
          "content": "Le texte exact à dire (voix-off ou face caméra)",
          "visualCue": "Suggestion visuelle pour le montage (ex: B-roll produit, texte à l'écran)",
          "duration": "Durée estimée de la section"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(request.template),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            estimatedTotalDuration: { type: Type.STRING },
            tone: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  visualCue: { type: Type.STRING },
                  duration: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        // Defensive coding: ensure sections is an array
        return {
          title: parsed.title || "Titre indisponible",
          estimatedTotalDuration: parsed.estimatedTotalDuration || "Durée inconnue",
          tone: parsed.tone || request.tone,
          sections: Array.isArray(parsed.sections) ? parsed.sections : []
        } as GeneratedScript;
      } catch (e) {
        console.error("Parsing error script:", e);
        throw new Error("Erreur de formatage du script reçu.");
      }
    }
    throw new Error("Aucune réponse générée.");
  } catch (error) {
    console.error("Erreur génération script:", error);
    throw error;
  }
};

export const generateSeo = async (request: GenerationRequest, scriptContext?: string): Promise<SeoData> => {
  if (!apiKey) throw new Error("API Key manquante.");

  const context = scriptContext ? `Basé sur ce script : ${scriptContext.substring(0, 1000)}...` : `Sujet : ${request.topic}`;

  const prompt = `
    Génère des métadonnées SEO YouTube optimisées en JSON.
    ${context}
    Langue : ${request.language}.
    
    Structure JSON requise :
    {
      "optimizedTitles": ["Titre 1 (Viral)", "Titre 2 (SEO)", "Titre 3 (Question)"],
      "description": "Description complète optimisée pour le SEO (2-3 paragraphes)",
      "tags": ["tag1", "tag2", "tag3", ...],
      "hashtags": ["#tag1", "#tag2", ...]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                optimizedTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        }
      }
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        // Defensive coding: ensure arrays are arrays
        return {
          optimizedTitles: Array.isArray(parsed.optimizedTitles) ? parsed.optimizedTitles : [],
          description: parsed.description || "",
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : []
        } as SeoData;
      } catch (e) {
        console.error("Parsing error SEO:", e);
        return { optimizedTitles: [], description: "Erreur de génération", tags: [], hashtags: [] };
      }
    }
    throw new Error("Aucune réponse SEO générée.");

  } catch (error) {
    console.error("Erreur génération SEO:", error);
    throw error;
  }
};