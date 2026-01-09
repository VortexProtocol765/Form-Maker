
import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-[-5%] left-[-10%] w-72 h-72 bg-primary/5 rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full space-y-12 z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-6 animate-fade-up">
          <div className="w-24 h-24 rounded-3xl bg-primary-dark flex items-center justify-center text-primary shadow-[0_0_40px_rgba(74,222,128,0.2)] border border-primary/20">
            <span className="material-symbols-outlined text-6xl">description</span>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
              Mil Form <span className="text-primary">Maker</span>
            </h1>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Precision Management Platform</p>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-4 px-4">
          {[
            { icon: 'bolt', title: 'Smart Generation', desc: 'AI-powered form construction in seconds.' },
            { icon: 'security', title: 'Field Ready', desc: 'Optimized for site inspections & healthcare.' },
            { icon: 'ios_share', title: 'Instant Export', desc: 'PDF, WhatsApp, and DOCX export.' }
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center gap-5 p-4 rounded-2xl bg-surface/50 border border-border-slate/50 animate-fade-up stagger-${idx + 1}`}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">{item.title}</h3>
                <p className="text-[11px] text-white/40 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Section */}
        <div className="pt-8 space-y-4 animate-fade-up stagger-4">
          <button 
            onClick={onStart}
            className="w-full bg-primary text-background py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(74,222,128,0.2)] hover:bg-primary-hover active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Enter Workspace
            <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
          </button>
          
          <div className="text-center">
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Version 1.2.0 • Emerald Edition</p>
          </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-[8px] font-black text-white/5 uppercase tracking-[0.5em] select-none">
        Developed for Efficiency
      </div>
    </div>
  );
};
