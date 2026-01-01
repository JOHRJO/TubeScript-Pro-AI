
import React, { useState, useEffect } from 'react';
import { TemplateType, GeneratedScript, SeoData, GenerationRequest, HistoryItem } from './types';
import { generateScript, generateSeo, login } from './services/geminiService';
import ScriptOutput from './components/ScriptOutput';
import SeoOutput from './components/SeoOutput';
import { Icons } from './components/Icons';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('ts_token'));
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // App States
  const [activeTemplate, setActiveTemplate] = useState<TemplateType | null>(null);
  const [topic, setTopic] = useState('');
  const [productName, setProductName] = useState('');
  const [tone, setTone] = useState('Engageant et Professionnel');
  const [language, setLanguage] = useState('Français');
  const [audience, setAudience] = useState('Débutants');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scriptResult, setScriptResult] = useState<GeneratedScript | null>(null);
  const [seoResult, setSeoResult] = useState<SeoData | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'seo'>('script');

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ts_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev;
          return prev + (100 / 80); // Simulation sur 80s
        });
      }, 1000);
    } else {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const saveToHistory = (script: GeneratedScript, seo: SeoData, topicText: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      script,
      seo,
      topic: topicText
    };
    const updatedHistory = [newItem, ...history].slice(0, 5); // Garder les 5 derniers
    setHistory(updatedHistory);
    localStorage.setItem('ts_history', JSON.stringify(updatedHistory));
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('ts_history', JSON.stringify(updatedHistory));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login(email);
      setIsAuthenticated(true);
    } catch (err) {
      alert("Erreur de connexion");
    } finally {
      setIsLoggingIn(false);
    }
  };

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
      const script = await generateScript(request);
      const sections = script.sections || [];
      const context = sections.map(s => s.content).join(' ').substring(0, 1000);
      const seo = await generateSeo(request, context);
      
      setScriptResult(script);
      setSeoResult(seo);
      saveToHistory(script, seo, topic);
    } catch (error: any) {
      alert(error.message || "Une erreur est survenue.");
      if (error.message === "Session invalide") {
        localStorage.removeItem('ts_token');
        setIsAuthenticated(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setScriptResult(item.script);
    setSeoResult(item.seo);
    setTopic(item.topic);
    setIsSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl">
          <div className="flex flex-col items-center mb-8">
             <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4">T</div>
             <h1 className="text-2xl font-bold text-white">Connexion à TubeScript</h1>
             <p className="text-slate-400 text-sm mt-2">Accédez à votre générateur de scripts AI</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              required 
              placeholder="Votre email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-lg transition-colors flex justify-center"
            >
              {isLoggingIn ? "Connexion..." : "Continuer"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Sidebar Historique */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-slate-800 border-l border-slate-700 p-6 shadow-2xl animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Icons.History className="w-5 h-5 text-brand-400" /> Historique
              </h2>
              <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-10">Aucun script récent.</p>
              ) : (
                history.map(item => (
                  <div key={item.id} onClick={() => loadFromHistory(item)} className="group bg-slate-900 p-4 rounded-xl border border-slate-700 hover:border-brand-500 cursor-pointer transition-all relative">
                    <button onClick={(e) => deleteHistoryItem(item.id, e)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 p-1">
                      <Icons.Trash className="w-3 h-3" />
                    </button>
                    <h4 className="font-bold text-white text-sm line-clamp-1 pr-4">{item.script.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.topic}</p>
                    <span className="text-[10px] text-slate-600 mt-2 block italic">{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTemplate(null)}>
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <h1 className="text-xl font-bold text-white">TubeScript Pro AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors border border-slate-700">
              <Icons.History className="w-5 h-5" />
            </button>
            <button onClick={() => { localStorage.removeItem('ts_token'); setIsAuthenticated(false); }} className="text-xs text-slate-500 hover:text-white">Déconnexion</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {!activeTemplate ? (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-10 text-white">Choisissez votre type de vidéo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button onClick={() => setActiveTemplate(TemplateType.KDP)} className="group p-8 bg-slate-800 border border-slate-700 rounded-2xl hover:border-brand-500 transition-all text-center">
                  <Icons.BookOpen className="w-10 h-10 mx-auto mb-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white">KDP (Livres)</h3>
                  <p className="text-xs text-slate-500 mt-2">Trailers de livres & promotion KDP</p>
              </button>
              <button onClick={() => setActiveTemplate(TemplateType.AFFILIATE)} className="group p-8 bg-slate-800 border border-slate-700 rounded-2xl hover:border-brand-500 transition-all text-center">
                  <Icons.DollarSign className="w-10 h-10 mx-auto mb-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white">Affiliation</h3>
                  <p className="text-xs text-slate-500 mt-2">Revue de produits & marketing</p>
              </button>
              <button onClick={() => setActiveTemplate(TemplateType.TUTORIAL)} className="group p-8 bg-slate-800 border border-slate-700 rounded-2xl hover:border-brand-500 transition-all text-center">
                  <Icons.GraduationCap className="w-10 h-10 mx-auto mb-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white">Tutoriel</h3>
                  <p className="text-xs text-slate-500 mt-2">Éducation & step-by-step</p>
              </button>
              <button onClick={() => setActiveTemplate(TemplateType.GENERAL)} className="group p-8 bg-slate-800 border border-slate-700 rounded-2xl hover:border-brand-500 transition-all text-center">
                  <Icons.Video className="w-10 h-10 mx-auto mb-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white">Général</h3>
                  <p className="text-xs text-slate-500 mt-2">Vlog, Divertissement & News</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-4">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Icons.Edit className="w-4 h-4 text-brand-400" /> Configuration
                  </h3>
                  <button onClick={() => setActiveTemplate(null)} className="text-xs text-brand-500 hover:underline">Changer Type</button>
                </div>
                <form onSubmit={handleGenerate} className="space-y-5">
                  <div>
                    <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Sujet de la vidéo</label>
                    <textarea 
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Décrivez votre sujet en détail..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none min-h-[120px] focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Ton</label>
                      <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white">
                        <option>Engageant</option>
                        <option>Professionnel</option>
                        <option>Humoristique</option>
                        <option>Inspirant</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Audience</label>
                      <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white">
                        <option>Débutants</option>
                        <option>Experts</option>
                        <option>Générale</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isGenerating || !topic}
                    className="w-full py-4 bg-brand-600 hover:bg-brand-500 rounded-xl font-bold text-white disabled:bg-slate-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <Icons.Loader className="w-5 h-5 animate-spin" /> : <Icons.Video className="w-5 h-5" />}
                    {isGenerating ? "Génération..." : "Générer mon Script"}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8">
               {isGenerating && (
                 <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-brand-400">Génération en cours...</span>
                      <span className="text-xs text-slate-500">Estimation: ~80s</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-700">
                      <div className="bg-brand-600 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 italic">L'IA de TubeScript analyse votre sujet et structure les séquences...</p>
                 </div>
               )}

               {scriptResult ? (
                 <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                    <div className="flex border-b border-slate-700 bg-slate-800/50">
                      <button onClick={() => setActiveTab('script')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'script' ? 'text-brand-400 bg-brand-400/10 border-b-2 border-brand-500' : 'text-slate-400 hover:bg-slate-700'}`}>
                        <Icons.FileText className="w-4 h-4" /> SCRIPT
                      </button>
                      <button onClick={() => setActiveTab('seo')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'seo' ? 'text-brand-400 bg-brand-400/10 border-b-2 border-brand-500' : 'text-slate-400 hover:bg-slate-700'}`}>
                        <Icons.Search className="w-4 h-4" /> SEO & TAGS
                      </button>
                    </div>
                    <div className="p-4 md:p-8">
                      {activeTab === 'script' ? (
                        <ScriptOutput 
                          script={scriptResult} 
                          seo={seoResult!} 
                          onUpdate={(updated) => {
                            setScriptResult(updated);
                            // Mettre à jour l'historique aussi
                            const newHist = history.map(h => h.script.id === updated.id ? {...h, script: updated} : h);
                            setHistory(newHist);
                            localStorage.setItem('ts_history', JSON.stringify(newHist));
                          }}
                        />
                      ) : (
                        <SeoOutput seo={seoResult!} />
                      )}
                    </div>
                 </div>
               ) : !isGenerating && (
                 <div className="h-96 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-800/10 p-10 text-center">
                    <Icons.Video className="w-16 h-16 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-slate-400 mb-2">Votre chef-d'œuvre commence ici</h3>
                    <p className="max-w-xs text-sm">Configurez les détails à gauche pour générer un script optimisé et ses métadonnées SEO.</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="border-t border-slate-800 mt-20 py-10 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TubeScript Pro AI. Sécurisé avec Gemini 2.5.</p>
      </footer>
    </div>
  );
};

export default App;
