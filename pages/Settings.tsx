
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { BottomNav } from '../components/BottomNav';

interface ThemeConfig {
  primaryColor: string;
  fontFamily: string;
  fontSize: number;
}

interface UserProfile {
  name: string;
  avatar: string;
}

export const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('milform_user_profile');
    return saved ? JSON.parse(saved) : { name: 'Guest Operator', avatar: '' };
  });

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('milform_theme_config');
    return saved ? JSON.parse(saved) : { primaryColor: '#4ade80', fontFamily: 'Poppins', fontSize: 16 };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    localStorage.setItem('milform_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('milform_theme_config', JSON.stringify(theme));
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--primary-hover', theme.primaryColor + 'cc');
    root.style.setProperty('--primary-dark', theme.primaryColor + '66');
    root.style.setProperty('--font-family', theme.fontFamily);
    root.style.setProperty('--base-font-size', theme.fontSize + 'px');
  }, [theme]);

  const colorPresets = [
    { name: 'Emerald', value: '#4ade80' },
    { name: 'Sky', value: '#38bdf8' },
    { name: 'Violet', value: '#a78bfa' },
    { name: 'Rose', value: '#fb7185' },
    { name: 'Amber', value: '#fbbf24' },
    { name: 'Slate', value: '#94a3b8' }
  ];

  const fontPresets = ['Poppins', 'Inter', 'Roboto Mono', 'System'];

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Layout title="Settings">
      <div className="px-5 py-4 space-y-8 pb-32">
        {/* User Profile Section */}
        <div className="flex flex-col items-center py-6 gap-3 animate-fade-up">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-primary-dark border-4 border-surface-accent flex items-center justify-center text-primary shadow-xl overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-5xl">person</span>
              )}
            </div>
            <button 
              onClick={() => {
                const url = prompt("Enter Image URL for profile picture:", profile.avatar);
                if (url !== null) setProfile({ ...profile, avatar: url });
              }}
              className="absolute bottom-0 right-0 bg-primary text-background p-1.5 rounded-full border-2 border-surface shadow-lg active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] block">photo_camera</span>
            </button>
          </div>
          
          <div className="text-center w-full px-4">
            {isEditingProfile ? (
              <div className="flex items-center gap-2 justify-center">
                <input 
                  autoFocus
                  className="bg-background/50 border-none ring-1 ring-border-slate focus:ring-primary rounded-lg px-3 py-1 text-center text-lg font-bold text-white w-full max-w-[200px]"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  onBlur={() => setIsEditingProfile(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingProfile(false)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center group cursor-pointer" onClick={() => setIsEditingProfile(true)}>
                <h3 className="text-lg font-bold text-white">{profile.name}</h3>
                <span className="material-symbols-outlined text-white/30 group-hover:text-primary transition-colors text-sm">edit</span>
              </div>
            )}
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">OPERATOR ACCOUNT</p>
          </div>
        </div>

        {/* Personalization Section */}
        <div className="space-y-4 animate-fade-up stagger-1">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] px-1">Personalization</h4>
          <div className="bg-surface-accent p-5 rounded-[2rem] border border-border-slate space-y-6 shadow-xl">
            {/* Color Theme */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Primary Color</label>
              <div className="flex flex-wrap gap-3">
                {colorPresets.map((c) => (
                  <button 
                    key={c.value}
                    onClick={() => setTheme({ ...theme, primaryColor: c.value })}
                    className={`w-10 h-10 rounded-full border-4 transition-all active:scale-90 ${theme.primaryColor === c.value ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Display Font</label>
              <div className="grid grid-cols-2 gap-2">
                {fontPresets.map((f) => (
                  <button 
                    key={f}
                    onClick={() => setTheme({ ...theme, fontFamily: f })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${theme.fontFamily === f ? 'bg-primary text-background border-primary' : 'bg-background text-white/40 border-border-slate'}`}
                    style={{ fontFamily: f }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Base Text Size</label>
                <span className="text-[10px] font-bold text-primary">{theme.fontSize}px</span>
              </div>
              <input 
                type="range" 
                min="12" 
                max="24" 
                step="1"
                className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer accent-primary"
                value={theme.fontSize}
                onChange={(e) => setTheme({ ...theme, fontSize: parseInt(e.target.value) })}
              />
              <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase">
                <span>Small</span>
                <span>Normal</span>
                <span>Large</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info & Support Section */}
        <div className="space-y-4 animate-fade-up stagger-2">
          <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] px-1">App Info & Developer</h4>
          <div className="space-y-4">
            <button 
              onClick={() => setShowAbout(true)}
              className="w-full flex items-center gap-4 bg-surface-accent p-4 rounded-2xl border border-border-slate hover:bg-white/5 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">info</span>
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold text-white">About Mil Form Maker</h5>
                <p className="text-[10px] text-white/30 font-medium">Platform version and core mission</p>
              </div>
              <span className="material-symbols-outlined text-white/20">chevron_right</span>
            </button>

            {/* Cleaned Developer Card - Alignment Fixed */}
            <div className="relative bg-surface-accent rounded-3xl border border-border-slate shadow-xl overflow-hidden">
              <div className="flex items-center gap-5 p-5">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-background flex items-center justify-center">
                    <img 
                      src="https://raw.githubusercontent.com/Masrur-Shopnil/image-hosting/main/dev-photo.jpg" 
                      alt="Capt. Md Masrur Masuk Shopnil" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/mil/200/200?grayscale';
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0 py-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <span className="material-symbols-outlined text-[10px] text-primary">verified</span>
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Creator</span>
                  </div>
                  <h5 className="text-[14px] font-black text-white uppercase tracking-tight leading-tight mb-1">
                    Capt. Md Masrur Masuk Shopnil, Sigs
                  </h5>
                  <a 
                    href="mailto:smasrur1633@gmail.com"
                    className="flex items-center gap-2 text-[10px] font-bold text-primary hover:text-primary-hover transition-colors truncate"
                  >
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    smasrur1633@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest border border-red-500/20 animate-fade-up stagger-3 active:scale-95 transition-all"
        >
          Logout & Reset
        </button>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-[360px] bg-surface rounded-[2.5rem] p-8 shadow-2xl animate-scale-in border border-border-slate">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-dark flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-3xl">description</span>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white uppercase tracking-tighter">About the App</h4>
                <p className="text-xs leading-relaxed text-white/60 font-medium">
                  Mil Form Maker is a professional-grade mobile application designed for efficient field reporting and template management. 
                </p>
                <p className="text-xs leading-relaxed text-white/60 font-medium">
                  Whether you're conducting site inspections, managing patient intakes, or generating high-priority reports, our platform streamlines the process with custom fields, scheduled timings, and smart export options.
                </p>
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Efficiency through structure.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAbout(false)}
                className="w-full py-4 bg-primary text-background font-bold text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-[340px] bg-surface rounded-[2.5rem] p-8 shadow-2xl animate-scale-in border border-red-500/20">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-red-950/30 flex items-center justify-center text-red-500 animate-pulse">
                <span className="material-symbols-outlined text-5xl">logout</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Confirm Reset</h4>
                <p className="text-sm font-medium text-white/70">
                  Are you sure you want to <span className="text-red-400 font-bold">Logout & Reset</span>?
                </p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                  All your templates, personal settings, and library data will be permanently cleared from this device.
                </p>
              </div>
              <div className="w-full flex flex-col gap-2 pt-4">
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 rounded-2xl bg-red-600 text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all hover:bg-red-500"
                >
                  Reset Everything
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
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
