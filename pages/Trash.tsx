
import React from 'react';
import { Layout } from '../components/Layout';
import { BottomNav } from '../components/BottomNav';
import { FormTemplate } from '../types';

interface TrashProps {
  templates: FormTemplate[];
  onRestore: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}

export const Trash: React.FC<TrashProps> = ({ templates, onRestore, onPermanentDelete }) => {
  const trashTemplates = templates.filter(t => t.isDeleted);

  return (
    <Layout title="Trash Bin">
      <div className="px-5 py-6 space-y-6 pb-32 animate-fade-up">
        <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-2xl flex items-start gap-3 shadow-inner">
          <span className="material-symbols-outlined text-red-400 text-lg">info</span>
          <p className="text-[10px] font-bold text-red-400 uppercase leading-relaxed tracking-tight">
            Items here can be restored to your library or permanently deleted. Permanent deletion is irreversible.
          </p>
        </div>

        <div className="space-y-4">
          {trashTemplates.length === 0 && (
            <div className="py-20 text-center text-white/20 italic text-sm flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-surface-accent flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">auto_delete</span>
              </div>
              <p className="uppercase tracking-widest font-bold text-[10px]">Trash is empty</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {trashTemplates.map(t => (
              <div key={t.id} className="flex items-center gap-4 bg-surface-accent p-3 rounded-2xl border border-border-slate animate-fade-up hover:border-white/5 transition-all">
                <div className="w-16 h-16 rounded-xl overflow-hidden grayscale opacity-50 relative group border border-white/5">
                  <img src={t.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white truncate">{t.title}</h4>
                  <p className="text-[9px] text-white/30 uppercase mt-1 font-bold">Deleted: {t.deletedAt ? new Date(t.deletedAt).toLocaleDateString() : 'Unknown'}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onRestore(t.id)} 
                    className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all active:scale-90"
                    title="Restore"
                  >
                    <span className="material-symbols-outlined text-xl">restore</span>
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm(`Permanently delete "${t.title}"? This cannot be undone.`)) {
                        onPermanentDelete(t.id);
                      }
                    }} 
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all active:scale-90"
                    title="Delete Forever"
                  >
                    <span className="material-symbols-outlined text-xl">delete_forever</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </Layout>
  );
};
