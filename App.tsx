import React, { useState, useEffect } from 'react';
import { TemplateType, GeneratedScript, SeoData, GenerationRequest } from './types';
import { generateScript, generateSeo } from './services/geminiService';
import ScriptOutput from './components/ScriptOutput';
import SeoOutput from './components/SeoOutput';
import { Icons } from './components/Icons';

const App: React.FC = () => {
  // State
  const [activeTemplate, setActiveTemplate] = useState<TemplateType | null>(null);
  const [topic, setTopic] = useState('');
  const [productName, setProductName] = useState('');
  const [tone, setTone] = useState('Engageant et Professionnel');
  const [language, setLanguage] = useState('Français');
  const [audience, setAudience] = useState('Débutants');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptResult, setScriptResult] = useState<GeneratedScript | null>(null);
  const [seoResult, setSeoResult] = useState<SeoData | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'seo'>('script');

  // Handlers
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTemplate || !topic) return;

    setIsGenerating(true);
    setScriptResult(null);
    setSeoResult(null);
    setActiveTab('script');

    const request: GenerationRequest = {
      topic,
      template: activeTemplate,
      language,
      tone,
      targetAudience: audience,
      productName: productName
    };

    try {
      // 1. Generate Script
      const script = await generateScript(request);
      setScriptResult(script);

      // 2. Generate SEO (in parallel or sequence - sequence is safer for context)
      // Construct context from script summary safely
      const sections = script.sections || [];
      const context = sections.map(s => s.content).join(' ').substring(0, 1500);
      
      const seo = await generateSeo(request, context);
      setSeoResult(seo);

    } catch (error) {
      alert("Une erreur est survenue lors de la génération. Vérifiez votre clé API ou réessayez.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setActiveTemplate(null);
    setScriptResult(null);
    setSeoResult(null);
    setTopic('');
  };

  // UI Components
  const TemplateCard = ({ type, icon, desc }: { type: TemplateType, icon: React.ReactNode, desc: string }) => (
    <button
      onClick={() => setActiveTemplate(type)}
      className="flex flex-col items-center p-8 bg-slate-800 border border-slate-700 rounded-2xl hover:bg-slate-750 hover:border-brand-500 hover:scale-105 transition-all duration-300 group text-center h-full w-full"
    >
      <div className="p-4 bg-slate-900 rounded-full mb-4 group-hover:text-brand-500 text-slate-300 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{type.split('(')[0]}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-brand-900 selection:text-white">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              TubeScript Pro AI
            </h1>
          </div>
          <div className="text-xs text-slate-500 border border-slate-800 px-3 py-1 rounded-full hidden sm:block">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* View 1: Template Selection */}
        {!activeTemplate && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Que voulez-vous créer aujourd'hui ?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Sélectionnez un modèle optimisé pour commencer à générer vos scripts et métadonnées sans effort.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <TemplateCard 
                type={TemplateType.KDP} 
                icon={<Icons.BookOpen className="w-8 h-8" />}
                desc="Trailers de livres, lectures d'extraits, bios d'auteurs pour Amazon KDP."
              />
              <TemplateCard 
                type={TemplateType.AFFILIATE} 
                icon={<Icons.DollarSign className="w-8 h-8" />}
                desc="Revues de produits, comparaisons, top 10 pour maximiser les clics."
              />
              <TemplateCard 
                type={TemplateType.TUTORIAL} 
                icon={<Icons.GraduationCap className="w-8 h-8" />}
                desc="Guides étape par étape, how-to et contenu éducatif clair."
              />
              <TemplateCard 
                type={TemplateType.GENERAL} 
                icon={<Icons.Video className="w-8 h-8" />}
                desc="Vlogs, storytelling et contenu généraliste viral."
              />
            </div>
          </div>
        )}

        {/* View 2: Generator Workspace */}
        {activeTemplate && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-lg font-bold text-white">Configuration</h3>
                   <button onClick={() => setActiveTemplate(null)} className="text-xs text-slate-400 hover:text-white underline">Changer</button>
                </div>

                <form onSubmit={handleGenerate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Modèle</label>
                    <div className="bg-slate-900 px-3 py-2 rounded border border-slate-700 text-brand-400 text-sm font-semibold">
                      {activeTemplate}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Sujet de la vidéo <span className="text-brand-500">*</span></label>
                    <textarea 
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="ex: Comment dresser un chien en 10 minutes..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                    />
                  </div>

                  {(activeTemplate === TemplateType.KDP || activeTemplate === TemplateType.AFFILIATE) && (
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Nom du Produit / Livre</label>
                      <input 
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="ex: iPhone 15 Pro, Le Seigneur des Anneaux..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Langue</label>
                      <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      >
                        <option>Français</option>
                        <option>Anglais</option>
                        <option>Espagnol</option>
                        <option>Allemand</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Ton</label>
                      <select 
                         value={tone} 
                         onChange={(e) => setTone(e.target.value)}
                         className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      >
                        <option>Engageant et Professionnel</option>
                        <option>Humoristique et Fun</option>
                        <option>Sérieux et Éducatif</option>
                        <option>Inspirant et Émotionnel</option>
                        <option>Urgent (Vente)</option>
                      </select>
                    </div>
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Public Cible</label>
                    <input 
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="ex: Débutants, Parents, Experts..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isGenerating || !topic}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
                      isGenerating || !topic
                        ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                        : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-lg shadow-brand-900/20'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <Icons.Wand2 className="w-5 h-5" />
                        Générer le Script
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-8">
               {/* Default State */}
               {!scriptResult && !isGenerating && (
                 <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl min-h-[400px] bg-slate-800/20 p-8 text-center">
                   <Icons.Wand2 className="w-16 h-16 mb-4 opacity-20" />
                   <p className="text-lg">Remplissez le formulaire à gauche pour générer votre contenu.</p>
                   <p className="text-sm mt-2 opacity-60">L'IA générera un script détaillé et des métadonnées SEO.</p>
                 </div>
               )}

               {/* Loading State */}
               {isGenerating && (
                 <div className="h-full flex flex-col items-center justify-center rounded-2xl min-h-[400px]">
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white animate-pulse">Création de la magie...</h3>
                    <p className="text-slate-400 mt-2">Rédaction du script et optimisation SEO en cours.</p>
                 </div>
               )}

               {/* Results State */}
               {scriptResult && !isGenerating && (
                 <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-700">
                      <button 
                        onClick={() => setActiveTab('script')}
                        className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === 'script' ? 'bg-slate-800 text-brand-400 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                      >
                        📜 Script Vidéo
                      </button>
                      <button 
                        onClick={() => setActiveTab('seo')}
                        className={`flex-1 py-4 text-center font-bold text-sm uppercase tracking-wider transition-colors ${activeTab === 'seo' ? 'bg-slate-800 text-brand-400 border-b-2 border-brand-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                      >
                        🔍 Métadonnées SEO
                      </button>
                    </div>

                    <div className="p-6 md:p-8">
                      {activeTab === 'script' ? (
                        <ScriptOutput script={scriptResult} />
                      ) : (
                        seoResult ? <SeoOutput seo={seoResult} /> : <div className="p-4 text-center text-slate-400">Chargement SEO...</div>
                      )}
                    </div>
                 </div>
               )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;