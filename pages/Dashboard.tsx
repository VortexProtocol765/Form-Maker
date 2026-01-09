
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { BottomNav } from '../components/BottomNav';
import { FormTemplate } from '../types';

interface DashboardProps {
  templates: FormTemplate[];
  onDelete: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ templates, onDelete }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deletingTemplate, setDeletingTemplate] = useState<FormTemplate | null>(null);

  const filtered = templates.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const confirmDelete = () => {
    if (deletingTemplate) {
      onDelete(deletingTemplate.id);
      setDeletingTemplate(null);
    }
  };

  return (
    <Layout title="Mil Form Maker">
      <div className="px-5 pb-4 space-y-4 animate-fade-up">
        <div className="group flex w-full items-center rounded-xl bg-background p-1 shadow-inner border border-border-slate transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
          <div className="flex h-10 w-10 items-center justify-center text-white/50">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            className="h-10 w-full bg-transparent text-sm font-semibold text-white placeholder:text-white/30 focus:outline-none border-none focus:ring-0 px-0" 
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-5 py-2">
        <div className="flex items-center justify-between mb-4 opacity-0 animate-fade-up stagger-1">
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Form Templates</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filtered.map((tpl, idx) => (
            <div 
              key={tpl.id} 
              className={`group relative flex flex-col gap-3 rounded-2xl bg-surface-accent p-3 shadow-sm border border-border-slate hover:border-primary/30 transition-all cursor-pointer opacity-0 animate-fade-up stagger-${(idx % 5) + 1}`}
            >
              <div onClick={() => navigate(`/fill/${tpl.id}`)} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-background/50">
                {tpl.image ? (
                  <img src={tpl.image} alt={tpl.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-white/10">
                    <span className="material-symbols-outlined text-4xl">image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white">
                  <span className="material-symbols-outlined text-xs">edit_note</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-1">
                  <h4 onClick={() => navigate(`/fill/${tpl.id}`)} className="text-sm font-bold text-white line-clamp-1 flex-1 leading-tight hover:text-primary transition-colors">
                    {tpl.title}
                  </h4>
                  <div className="flex gap-0.5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/builder/${tpl.id}`); }} 
                      className="text-white/40 hover:text-primary transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation();
                        e.preventDefault();
                        setDeletingTemplate(tpl);
                      }} 
                      className="text-white/40 hover:text-red-400 transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-[9px] font-semibold text-white/30 mt-1 uppercase tracking-tighter">Updated: {tpl.lastEdited}</p>
              </div>
            </div>
          ))}

          <div 
            onClick={() => navigate('/builder')} 
            className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-background/30 p-3 border-2 border-dashed border-border-slate hover:border-primary hover:bg-primary/5 transition-all cursor-pointer h-full min-h-[160px] opacity-0 animate-fade-up stagger-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-accent text-white/30 group-hover:bg-primary group-hover:text-background transition-all group-hover:rotate-90">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
            <p className="text-xs font-bold text-white/40 group-hover:text-primary text-center uppercase tracking-widest transition-colors">New Form</p>
          </div>
        </div>
      </div>

      {deletingTemplate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-[340px] bg-surface rounded-[2.5rem] p-8 shadow-2xl animate-scale-in border border-red-500/20">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-red-950/30 flex items-center justify-center text-red-500 animate-pulse">
                <span className="material-symbols-outlined text-5xl">warning</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Delete Form?</h4>
                <p className="text-sm font-medium text-white/70">
                  Are you sure you want to delete <span className="font-bold text-red-400">"{deletingTemplate.title}"</span>?
                </p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">This action will move it to trash</p>
              </div>
              <div className="w-full flex flex-col gap-2 pt-4">
                <button 
                  onClick={confirmDelete}
                  className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all hover:bg-red-500"
                >
                  Delete Form
                </button>
                <button 
                  onClick={() => setDeletingTemplate(null)}
                  className="w-full py-3 rounded-2xl bg-surface-accent text-white/50 font-bold text-xs uppercase tracking-widest active:scale-95 transition-all hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </Layout>
  );
};
