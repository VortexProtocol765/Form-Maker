
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';
import { Filler } from './pages/Filler';
import { Export } from './pages/Export';
import { Library } from './pages/Library';
import { Trash } from './pages/Trash';
import { Settings } from './pages/Settings';
import { FormTemplate } from './types';
import { INITIAL_TEMPLATES } from './constants';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return localStorage.getItem('milform_has_started') === 'true';
  });

  const [templates, setTemplates] = useState<FormTemplate[]>(() => {
    const saved = localStorage.getItem('milform_templates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load templates", e);
      }
    }
    return INITIAL_TEMPLATES;
  });

  useEffect(() => {
    // Apply personalization settings on mount
    const savedTheme = localStorage.getItem('milform_theme_config');
    if (savedTheme) {
      try {
        const config = JSON.parse(savedTheme);
        const root = document.documentElement;
        if (config.primaryColor) {
          root.style.setProperty('--primary-color', config.primaryColor);
          root.style.setProperty('--primary-hover', config.primaryColor + 'cc');
          root.style.setProperty('--primary-dark', config.primaryColor + '66');
        }
        if (config.fontFamily) {
          root.style.setProperty('--font-family', config.fontFamily);
        }
        if (config.fontSize) {
          root.style.setProperty('--base-font-size', config.fontSize + 'px');
        }
      } catch (e) {
        console.error("Failed to load theme config", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('milform_templates', JSON.stringify(templates));
  }, [templates]);

  const handleStart = () => {
    setHasStarted(true);
    localStorage.setItem('milform_has_started', 'true');
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.map(t => 
      String(t.id) === String(id) 
        ? { ...t, isDeleted: true, deletedAt: new Date().toISOString() } 
        : t
    ));
  };

  const handlePermanentDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => String(t.id) !== String(id)));
  };

  const handleRestore = (id: string) => {
    setTemplates(prev => prev.map(t => 
      String(t.id) === String(id) 
        ? { ...t, isDeleted: false, deletedAt: undefined } 
        : t
    ));
  };

  const handleSave = (t: FormTemplate) => {
    setTemplates(prev => {
      const exists = prev.find(x => String(x.id) === String(t.id));
      if (exists) {
        return prev.map(x => String(x.id) === String(t.id) ? t : x);
      }
      return [t, ...prev];
    });
  };

  // Helper component to protect routes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!hasStarted) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={hasStarted ? <Navigate to="/dashboard" replace /> : <Welcome onStart={handleStart} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard 
                templates={templates.filter(t => !t.isDeleted)} 
                onDelete={handleDelete}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
            path="/builder/:id?" 
            element={
                <ProtectedRoute>
                  <Builder 
                      onSave={handleSave} 
                      templates={templates}
                  />
                </ProtectedRoute>
            } 
        />
        <Route path="/fill/:id" element={<ProtectedRoute><Filler templates={templates} /></ProtectedRoute>} />
        <Route path="/export" element={<ProtectedRoute><Export /></ProtectedRoute>} />
        <Route 
          path="/library" 
          element={
            <ProtectedRoute>
              <Library 
                templates={templates} 
                onDelete={handleDelete}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trash" 
          element={
            <ProtectedRoute>
              <Trash 
                templates={templates} 
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
              />
            </ProtectedRoute>
          } 
        />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Fallback for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
