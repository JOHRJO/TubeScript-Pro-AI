import React from 'react';
import { SeoData } from '../types';
import { Icons } from './Icons';

interface SeoOutputProps {
  seo: SeoData;
}

const SeoOutput: React.FC<SeoOutputProps> = ({ seo }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copié !");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Titles */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold text-brand-400 mb-4 flex items-center gap-2">
          <Icons.Search className="w-5 h-5" />
          Titres Optimisés
        </h3>
        <div className="space-y-3">
          {(seo.optimizedTitles || []).map((title, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-900 p-3 rounded border border-slate-700 group">
              <span className="text-slate-200 font-medium">{title}</span>
              <button 
                onClick={() => copyToClipboard(title)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity"
              >
                <Icons.Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
            📝 Description
            </h3>
             <button 
                onClick={() => copyToClipboard(seo.description)}
                className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white transition-colors"
            >
                Copier
            </button>
        </div>
        
        <div className="bg-slate-900 p-4 rounded border border-slate-700 whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">
          {seo.description}
        </div>
      </div>

      {/* Tags & Hashtags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-green-400">Tags (Mots-clés)</h3>
             <button 
                onClick={() => copyToClipboard(seo.tags?.join(', ') || '')}
                className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white transition-colors"
            >
                Copier Tout
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(seo.tags || []).map((tag, idx) => (
              <span key={idx} className="bg-slate-900 text-slate-300 px-3 py-1 rounded-full text-sm border border-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-purple-400">Hashtags</h3>
             <button 
                onClick={() => copyToClipboard(seo.hashtags?.join(' ') || '')}
                className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-white transition-colors"
            >
                Copier Tout
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(seo.hashtags || []).map((tag, idx) => (
              <span key={idx} className="text-purple-300 text-sm font-medium">
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