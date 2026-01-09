
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { BottomNav } from '../components/BottomNav';
import { FormTemplate, PriorityLevel } from '../types';

interface LibraryProps {
  templates: FormTemplate[];
  onDelete: (id: string) => void;
}

export const Library: React.FC<LibraryProps> = ({ templates, onDelete }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'recipients' | 'timings' | 'priority'>('recipients');
  const [deletingTemplate, setDeletingTemplate] = useState<FormTemplate | null>(null);

  const filteredTemplates = templates.filter(t => !t.isDeleted);

  // Helper to group templates
  const recipients = Array.from(new Set(filteredTemplates.map(t => t.recipient?.name).filter(Boolean)));
  const priorities = Object.values(PriorityLevel);

  const getPriorityColor = (level?: PriorityLevel) => {
    switch (level) {
      case PriorityLevel.FLASH: return 'text-red-500';
      case PriorityLevel.IMMEDIATE: return 'text-orange-500';
      case PriorityLevel.PRIORITY: return 'text-yellow-500';
      default: return 'text-primary';
    }
  };

  const confirmDelete = () => {
    if (deletingTemplate) {
      onDelete(deletingTemplate.id);
      setDeletingTemplate(null);
    }
  };

  return (
    <Layout title="Template Library">
      <div className="px-5 pb-4 animate-fade-up">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 border-b border-border-slate sticky top-0 bg-surface z-10">
          {['recipients', 'timings', 'priority'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-background' : 'text-white/40 bg-white/5 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-6 space-y-8 pb-32">
          {activeTab === 'recipients' && (
            <div className="space-y-8">
              {recipients.length === 0 && (
                <div className="py-12 text-center text-white/20 italic text-sm">No recipients assigned yet.</div>
              )}
              {recipients.map(recipient => (
                <div key={recipient} className="space-y-4 animate-fade-up">
                  <div className="flex items-center gap-3 px-1">
                    <div className="w-10 h-10 rounded-full bg-primary-dark flex items-center justify-center text-white overflow-hidden border border-border-slate">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">{recipient}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {filteredTemplates.filter(t => t.recipient?.name === recipient).map(t => (
                      <LibraryTemplateCard 
                        key={t.id} 
                        template={t} 
                        onEdit={() => navigate(`/builder/${t.id}`)}
                        onDelete={() => setDeletingTemplate(t)}
                        onFill={() => navigate(`/fill/${t.id}`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timings' && (
            <div className="space-y-8">
              {['Morning', 'Afternoon', 'Evening', 'Unscheduled'].map((period) => {
                const tpls = filteredTemplates.filter(t => {
                  if (!t.schedule?.time) return period === 'Unscheduled';
                  const hour = parseInt(t.schedule.time.split(':')[0]);
                  if (period === 'Morning') return hour >= 5 && hour < 12;
                  if (period === 'Afternoon') return hour >= 12 && hour < 17;
                  if (period === 'Evening') return hour >= 17 || hour < 5;
                  return false;
                });
                if (tpls.length === 0) return null;
                return (
                  <div key={period} className="space-y-4 animate-fade-up">
                    <div className="flex items-center justify-between px-1">
                      <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{period}</h4>
                      <span className="text-[10px] text-primary font-bold">{tpls.length} FORMS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {tpls.map(t => (
                        <LibraryTemplateCard 
                          key={t.id} 
                          template={t} 
                          onEdit={() => navigate(`/builder/${t.id}`)}
                          onDelete={() => setDeletingTemplate(t)}
                          onFill={() => navigate(`/fill/${t.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'priority' && (
            <div className="space-y-8">
              {priorities.map(lvl => {
                const tpls = filteredTemplates.filter(t => (t.priority || PriorityLevel.ROUTINE) === lvl);
                return (
                  <div key={lvl} className="space-y-4 animate-fade-up">
                    <div className="flex items-center gap-2 px-1">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(lvl).replace('text-', 'bg-')}`} />
                      <h4 className={`text-[10px] font-bold uppercase tracking-widest ${getPriorityColor(lvl)}`}>{lvl}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {tpls.map(t => (
                        <LibraryTemplateCard 
                          key={t.id} 
                          template={t} 
                          onEdit={() => navigate(`/builder/${t.id}`)}
                          onDelete={() => setDeletingTemplate(t)}
                          onFill={() => navigate(`/fill/${t.id}`)}
                        />
                      ))}
                    </div>
                    {tpls.length === 0 && <div className="text-[9px] text-white/10 px-1">No forms in this level.</div>}
                  </div>
                );
              })}
            </div>
          )}
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
                  Move <span className="font-bold text-red-400">"{deletingTemplate.title}"</span> to trash?
                </p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                  You can restore it later from the trash page.
                </p>
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

// Same card style as Dashboard
const LibraryTemplateCard = ({ template, onEdit, onDelete, onFill }: { 
  template: FormTemplate, 
  onEdit: () => void,
  onDelete: () => void,
  onFill: () => void
}) => (
  <div 
    className="group relative flex flex-col gap-3 rounded-2xl bg-surface-accent p-3 shadow-sm border border-border-slate hover:border-primary/30 transition-all cursor-pointer animate-fade-up"
  >
    <div onClick={onFill} className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-background/50">
      {template.image ? (
        <img src={template.image} alt={template.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
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
        <h4 onClick={onFill} className="text-sm font-bold text-white line-clamp-1 flex-1 leading-tight hover:text-primary transition-colors">
          {template.title}
        </h4>
        <div className="flex gap-0.5">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }} 
            className="text-white/40 hover:text-primary transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-90"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation();
              onDelete();
            }} 
            className="text-white/40 hover:text-red-400 transition-colors p-1 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-90"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
      <p className="text-[9px] font-semibold text-white/30 mt-1 uppercase tracking-tighter">Updated: {template.lastEdited}</p>
    </div>
  </div>
);
