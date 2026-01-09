
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  showBack, 
  onBack,
  actions 
}) => {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-surface relative flex flex-col border-x border-border-slate">
        {/* Header */}
        <header className="flex items-center justify-between p-5 pt-8 sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-border-slate">
          <div className="flex items-center gap-3">
            {showBack && (
              <button onClick={onBack} className="p-1 -ml-2 text-white/70 hover:bg-white/5 rounded-full transition-colors">
                <span className="material-symbols-outlined text-3xl">chevron_left</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary-dark flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-2xl">description</span>
              </div>
              <h2 className="text-lg font-bold leading-none tracking-tight text-white truncate max-w-[160px]">{title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
