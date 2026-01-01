
import React, { useState } from 'react';
import { GeneratedScript, SeoData } from '../types';
import { Icons } from './Icons';
import { exportToPdf, exportToDocx } from '../services/exportService';

interface ScriptOutputProps {
  script: GeneratedScript;
  seo: SeoData;
  onUpdate?: (updatedScript: GeneratedScript) => void;
}

const ScriptOutput: React.FC<ScriptOutputProps> = ({ script, seo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSections, setEditedSections] = useState(script.sections);
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const fullScriptText = editedSections.map(s => `${s.title}\n${s.content}`).join('\n\n');

  const handleSave = () => {
    const updated = { ...script, sections: editedSections };
    onUpdate?.(updated);
    setIsEditing(false);
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const text = encodeURIComponent(`Nouveau script YouTube généré avec TubeScript Pro AI : ${script.title}`);
    const url = encodeURIComponent(window.location.href);
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-10 bg-brand-600 text-white px-4 py-2 rounded-lg shadow-lg z-[60] flex items-center gap-2 animate-bounce">
          <Icons.Check className="w-4 h-4" /> Copié !
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{script?.title || "Chargement..."}</h2>
          <div className="flex gap-4 mt-2 text-sm text-slate-400">
            <span>⏱ {script?.estimatedTotalDuration}</span>
            <span>🎭 {script?.tone}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg transition-colors text-sm border border-slate-600"
          >
            {isEditing ? <Icons.Save className="w-4 h-4" /> : <Icons.Edit className="w-4 h-4" />}
            {isEditing ? "Terminer" : "Modifier"}
          </button>
          
          <div className="relative group">
            <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-3 py-2 rounded-lg transition-colors text-sm font-bold">
              <Icons.Download className="w-4 h-4" /> Exporter
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-20">
              <button onClick={() => exportToPdf(script, seo)} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm flex items-center gap-2">
                <Icons.FileText className="w-4 h-4 text-red-400" /> PDF (.pdf)
              </button>
              <button onClick={() => exportToDocx(script, seo)} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm flex items-center gap-2">
                <Icons.FileText className="w-4 h-4 text-blue-400" /> Word (.docx)
              </button>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-bold">
              <Icons.Share className="w-4 h-4" /> Partager
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-20">
              <button onClick={() => handleShare('twitter')} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm">Twitter</button>
              <button onClick={() => handleShare('linkedin')} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm">LinkedIn</button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {editedSections.map((section, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative group">
             <div className="absolute top-4 right-4 flex gap-2">
               <button 
                  onClick={() => copyToClipboard(section.content)}
                  className="bg-slate-700 p-2 rounded hover:bg-slate-600 transition-all opacity-0 group-hover:opacity-100"
                  title="Copier section"
                >
                  <Icons.Copy className="w-4 h-4 text-white" />
                </button>
             </div>

            <div className="flex items-center gap-3 mb-3">
              <span className="bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded uppercase">
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
                {isEditing ? (
                  <textarea 
                    value={section.content}
                    onChange={(e) => {
                      const newSections = [...editedSections];
                      newSections[idx].content = e.target.value;
                      setEditedSections(newSections);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white outline-none focus:ring-1 focus:ring-brand-500 min-h-[150px] font-mono text-sm"
                  />
                ) : (
                  <p className="text-slate-200 whitespace-pre-wrap leading-relaxed font-medium">
                    {section.content}
                  </p>
                )}
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 h-fit">
                <h4 className="text-brand-400 text-xs uppercase font-semibold mb-2 flex items-center gap-2">
                  <Icons.Video className="w-3 h-3" /> Visuel
                </h4>
                {isEditing ? (
                  <input 
                    type="text"
                    value={section.visualCue}
                    onChange={(e) => {
                      const newSections = [...editedSections];
                      newSections[idx].visualCue = e.target.value;
                      setEditedSections(newSections);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-slate-300 text-xs outline-none"
                  />
                ) : (
                  <p className="text-slate-400 text-sm italic">{section.visualCue}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {isEditing && (
          <div className="flex justify-end">
             <button 
              onClick={handleSave}
              className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg"
            >
              Sauvegarder les modifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptOutput;
