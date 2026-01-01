
import React, { useState } from 'react';
import { SeoData } from '../types';
import { Icons } from './Icons';

interface SeoOutputProps {
  seo: SeoData;
}

const SeoOutput: React.FC<SeoOutputProps> = ({ seo }) => {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const titles = seo?.optimizedTitles || [];
  const tags = seo?.tags || [];
  const hashtags = seo?.hashtags || [];

  return (
    <div className="space-y-8 relative">
       {/* Toast Notification */}
       {showToast && (
        <div className="fixed top-20 right-10 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-lg z-[60] flex items-center gap-2 animate-bounce">
          <Icons.Check className="w-4 h-4" /> Copié !
        </div>
      )}

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-brand-400 flex items-center gap-2">
            <Icons.Search className="w-5 h-5" /> Titres Optimisés
          </h3>
          <button onClick={() => copyToClipboard(titles.join("\n"))} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
            <Icons.Copy className="w-3 h-3" /> Copier tout
          </button>
        </div>
        <div className="space-y-3">
          {titles.map((title, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-700 group hover:border-brand-500/50 transition-colors">
              <span className="text-slate-200 font-medium">{title}</span>
              <button onClick={() => copyToClipboard(title)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white p-2">
                <Icons.Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
              <Icons.FileText className="w-5 h-5" /> Description Vidéo
            </h3>
            <button 
              onClick={() => copyToClipboard(seo?.description || '')} 
              className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-lg text-white font-bold transition-colors border border-slate-600"
            >
              Copier la description
            </button>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 whitespace-pre-wrap text-slate-300 text-sm leading-relaxed max-h-64 overflow-y-auto">
          {seo?.description || "Pas de description."}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-green-400">Tags</h3>
            <button onClick={() => copyToClipboard(tags.join(","))} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold tracking-wider">Copier CSV</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-slate-900 text-slate-300 px-3 py-1 rounded-full text-xs border border-slate-700 hover:bg-slate-800 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold text-purple-400 mb-4">Hashtags</h3>
          <div className="flex flex-wrap gap-3">
            {hashtags.map((tag, idx) => (
              <span key={idx} onClick={() => copyToClipboard(tag)} className="text-purple-300 text-sm font-bold cursor-pointer hover:text-purple-100 transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoOutput;
