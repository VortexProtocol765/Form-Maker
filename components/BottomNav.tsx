
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: 'home', label: 'Home', path: '/dashboard' },
    { icon: 'folder', label: 'Library', path: '/library' },
    { icon: 'delete', label: 'Trash', path: '/trash' },
    { icon: 'settings', label: 'Settings', path: '/settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto h-20 bg-surface/95 backdrop-blur-md border-t border-border-slate flex items-center justify-around px-2 pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button 
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 flex-1 transition-all ${isActive ? 'text-primary' : 'text-white/40 hover:text-white'} active:scale-90`}
          >
            <span className={`material-symbols-outlined text-2xl ${isActive ? 'font-bold' : ''}`}>{item.icon}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
