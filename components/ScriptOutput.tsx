import React from 'react';
import { GeneratedScript } from '../types';
import { Icons } from './Icons';

interface ScriptOutputProps {
  script: GeneratedScript;
}

const ScriptOutput: React.FC<ScriptOutputProps> = ({ script }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Texte copié !");
  };

  const fullScriptText = (script.sections || []).map(s => `${s.title}\n${s.content}`).join('\n\n');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{script.title}</h2>
          <div className="flex gap-4 mt-2 text-sm text-slate-400">
            <span>⏱ {script.estimatedTotalDuration}</span>
            <span>🎭 {script.tone}</span>
          </div>
        </div>
        <button 
          onClick={() => copyToClipboard(fullScriptText)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg transition-colors text-sm border border-slate-600"
        >
          <Icons.Copy className="w-4 h-4" />
          Copier Tout
        </button>
      </div>

      <div className="space-y-6">
        {(script.sections || []).map((section, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative group">
             <button 
                onClick={() => copyToClipboard(section.content)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 bg-slate-700 p-2 rounded hover:bg-slate-600 transition-all"
                title="Copier cette section"
              >
                <Icons.Copy className="w-4 h-4 text-white" />
              </button>

            <div className="flex items-center gap-3 mb-3">
              <span className="bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                {section.title}
              </span>
              {section.duration && (
                <span className="text-xs text-slate-400 border border-slate-600 px-2 py-1 rounded">
                  {section.duration}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h4 className="text-slate-400 text-xs uppercase font-semibold mb-2">Audio / Script</h4>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed font-medium font-sans">
                  {section.content}
                </p>
              </div>
              
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 h-fit">
                <h4 className="text-brand-400 text-xs uppercase font-semibold mb-2 flex items-center gap-2">
                  <Icons.Video className="w-3 h-3" />
                  Visuel Suggéré
                </h4>
                <p className="text-slate-400 text-sm italic">
                  {section.visualCue || "Face caméra ou B-roll pertinent"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptOutput;