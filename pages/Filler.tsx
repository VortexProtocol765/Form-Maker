
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FormTemplate, FieldType, TextStyle } from '../types';

interface FillerProps {
  templates: FormTemplate[];
}

export const Filler: React.FC<FillerProps> = ({ templates }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const template = templates.find(t => String(t.id) === String(id));
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [inputStyles, setInputStyles] = useState<Record<string, TextStyle>>({});

  if (!template) {
    return (
      <Layout title="Error" showBack onBack={() => navigate('/')}>
        <div className="p-12 text-center flex flex-col items-center gap-4 animate-scale-in">
          <span className="material-symbols-outlined text-6xl text-white/20">error</span>
          <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Template Missing</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-primary text-background rounded-xl font-bold text-xs uppercase hover:bg-primary-hover transition-colors shadow-lg active:scale-95"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const toggleInputStyle = (fieldId: string, style: keyof TextStyle) => {
    setInputStyles(prev => {
      const current = prev[fieldId] || { bold: false, italic: false };
      return {
        ...prev,
        [fieldId]: {
          ...current,
          [style]: !current[style]
        }
      };
    });
  };

  const handleExport = () => {
    const exportItems: any[] = template.fields.map(f => ({
      label: f.label,
      value: f.type === FieldType.FORM_TEXT ? null : (formData[f.id] || ''),
      type: f.type,
      labelStyle: f.labelStyle,
      inputStyle: inputStyles[f.id] || f.inputStyle || { bold: false, italic: false }
    }));
    
    navigate('/export', { state: { templateTitle: template.title, exportItems } });
  };

  const inputCount = template.fields.filter(f => f.type !== FieldType.FORM_TEXT).length;
  const filledCount = Object.keys(formData).filter(key => {
    const field = template.fields.find(f => f.id === key);
    return field && field.type !== FieldType.FORM_TEXT && formData[key] && formData[key].toString().trim() !== '';
  }).length;

  return (
    <Layout title={template.title} showBack onBack={() => navigate('/')}>
      <div className="p-5 space-y-6 pb-32 animate-fade-up">
        <div className="flex flex-col gap-1.5 p-4 bg-background/30 rounded-2xl border border-border-slate/50">
          <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <span>Progress</span>
            <span className="text-primary">{inputCount > 0 ? Math.round((filledCount / inputCount) * 100) : 100}%</span>
          </div>
          <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-border-slate">
            <div 
              className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_15px_rgba(74,222,128,0.5)]" 
              style={{ width: `${inputCount > 0 ? (filledCount / inputCount) * 100 : 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-8">
          {template.fields.map((field, idx) => {
            if (field.type === FieldType.FORM_TEXT) {
              return (
                <div key={field.id} className="pt-4 first:pt-0 animate-fade-up stagger-1">
                  <p className={`text-sm leading-relaxed text-white ${field.labelStyle?.bold ? 'font-black' : 'font-semibold'} ${field.labelStyle?.italic ? 'italic' : ''}`}>
                    {field.label}
                  </p>
                </div>
              );
            }

            const currentInputStyle = inputStyles[field.id] || field.inputStyle || { bold: false, italic: false };

            return (
              <div key={field.id} className={`space-y-3 group animate-fade-up stagger-${(idx % 5) + 1}`}>
                <div className="flex justify-between items-end">
                   <label className={`text-xs text-white/60 transition-colors group-focus-within:text-primary ${field.labelStyle?.bold ? 'font-black' : 'font-semibold'} ${field.labelStyle?.italic ? 'italic' : ''}`}>
                    {field.label} {field.required && <span className="text-red-500 animate-pulse">*</span>}
                  </label>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => toggleInputStyle(field.id, 'bold')}
                      className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold border transition-all ${currentInputStyle.bold ? 'bg-primary text-background border-primary' : 'bg-background text-white/30 border-border-slate hover:bg-white/5'}`}
                    >B</button>
                    <button 
                      onClick={() => toggleInputStyle(field.id, 'italic')}
                      className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-bold border italic transition-all ${currentInputStyle.italic ? 'bg-primary text-background border-primary' : 'bg-background text-white/30 border-border-slate hover:bg-white/5'}`}
                    >I</button>
                  </div>
                </div>
                
                {field.description && (
                  <p className="text-[10px] text-white/40 font-medium italic">
                    {field.description}
                  </p>
                )}
                
                {field.type === FieldType.DATE ? (
                  <input 
                    type="date"
                    className="w-full h-12 px-4 rounded-xl border-border-slate bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-white transition-all"
                    value={formData[field.id] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  />
                ) : (
                  <input 
                    type="text"
                    className={`w-full h-12 px-4 rounded-xl border-border-slate bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary text-white placeholder:text-white/10 transition-all ${currentInputStyle.bold ? 'font-bold' : 'font-medium'} ${currentInputStyle.italic ? 'italic' : ''}`}
                    value={formData[field.id] || ''}
                    placeholder="Enter data..."
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface/95 backdrop-blur-md border-t border-border-slate p-4 pb-8 z-30 shadow-lg flex gap-3">
        <button onClick={() => navigate('/')} className="flex-1 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest text-white/40 border-2 border-border-slate hover:bg-white/5 transition-all active:scale-95">Cancel</button>
        <button onClick={handleExport} className="flex-[2] bg-primary text-background py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-95">Generate Form</button>
      </div>
    </Layout>
  );
};
