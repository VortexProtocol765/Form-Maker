
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FieldType, TextStyle } from '../types';

type ExportFormat = 'pdf' | 'whatsapp' | 'docx' | 'csv';

export const Export: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<ExportFormat>('pdf');
  const [showPreview, setShowPreview] = useState(false);

  const state = location.state as { 
    templateTitle?: string; 
    exportItems?: { label: string; value: any; type: FieldType; labelStyle?: TextStyle; inputStyle?: TextStyle }[] 
  } | null;

  const templateTitle = state?.templateTitle || "FORM";
  const items = state?.exportItems || [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const formatValue = (item: { value: any; type: FieldType }) => {
    if (item.type === FieldType.DATE) return formatDate(item.value);
    return String(item.value || '');
  };

  const applyWAStyle = (text: string, style?: TextStyle, forceBold: boolean = false) => {
    if (!style && !forceBold) return text;
    let result = text;
    if (forceBold || style?.bold) result = `*${result}*`;
    if (style?.italic) result = `_${result}_`;
    return result;
  };

  const generateWhatsAppText = () => {
    let text = `*${templateTitle.toUpperCase()}*\n\n`;
    
    items.forEach((item) => {
      const label = (item.label || '').trim();
      const val = formatValue(item);
      const isPlaceholder = label === '' || label === 'Field Label' || label === 'New Form';

      if (item.type === FieldType.FORM_TEXT) {
        if (label && !isPlaceholder) {
          text += `${applyWAStyle(label, item.labelStyle)}\n\n`;
        }
      } else {
        if (val && val.trim() !== '') {
          if (label && !isPlaceholder) {
            text += `*${label}*\n${applyWAStyle(val, item.inputStyle)}\n\n`;
          } else {
            text += `${applyWAStyle(val, item.inputStyle)}\n\n`;
          }
        }
      }
    });
    
    return text.trim();
  };

  const handleExportAction = () => {
    alert(`${selected.toUpperCase()} Generated.`);
    setTimeout(() => navigate('/'), 1000);
  };

  const copyWhatsApp = () => {
    const text = generateWhatsAppText();
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
    setShowPreview(false);
    navigate('/');
  };

  const PreviewContent = () => {
    switch (selected) {
      case 'whatsapp':
        return (
          <div className="bg-[#0f140f] p-5 rounded-2xl text-[13px] font-sans whitespace-pre-wrap max-h-[400px] overflow-y-auto mb-6 border border-border-slate text-white animate-scale-in">
            <div className="bg-surface p-4 rounded-lg shadow-sm border border-border-slate">
              {generateWhatsAppText()}
            </div>
          </div>
        );
      case 'pdf':
      case 'docx':
        return (
          <div className="bg-surface-accent p-10 rounded-lg shadow-sm border border-border-slate text-white min-h-[400px] max-h-[400px] overflow-y-auto mb-6 text-[12px] animate-scale-in">
            <div className="border-b-2 border-primary/50 pb-4 mb-8">
              <h1 className="text-2xl font-bold uppercase tracking-tighter leading-none text-primary">{templateTitle}</h1>
            </div>
            <div className="space-y-6">
              {items.map((item, idx) => {
                const label = (item.label || '').trim();
                const val = formatValue(item);
                const isPlaceholder = label === '' || label === 'Field Label';
                
                if (item.type === FieldType.FORM_TEXT) {
                  return label && !isPlaceholder ? (
                    <div key={idx} className="pt-2 animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <p className={`leading-relaxed text-white/80 ${item.labelStyle?.bold ? 'font-bold' : 'font-medium'} ${item.labelStyle?.italic ? 'italic' : ''}`}>{label}</p>
                    </div>
                  ) : null;
                }
                
                if (!val || val.trim() === '') return null;

                return (
                  <div key={idx} className="border-b border-border-slate/50 pb-3 animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                    {label && !isPlaceholder && (
                      <p className="text-[11px] font-bold text-primary uppercase mb-1 tracking-widest">{label}</p>
                    )}
                    <p className={`text-sm leading-relaxed text-white ${item.inputStyle?.bold ? 'font-bold' : 'font-medium'} ${item.inputStyle?.italic ? 'italic' : ''}`}>{val}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'csv':
        return (
          <div className="bg-surface rounded-2xl border-2 border-border-slate overflow-hidden mb-6 max-h-[400px] overflow-y-auto shadow-inner animate-scale-in">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-accent border-b-2 border-border-slate">
                <tr>
                  <th className="p-4 font-bold text-white border-r border-border-slate uppercase">Field</th>
                  <th className="p-4 font-bold text-white uppercase">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/50">
                {items.map((item, idx) => (
                  <tr key={idx} className="animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <td className="p-4 font-bold text-white/40 border-r border-border-slate bg-background/30 uppercase">
                      {item.type === FieldType.FORM_TEXT ? 'INFO' : (item.label || 'DATA')}
                    </td>
                    <td className="p-4 text-white font-bold">
                      {item.type === FieldType.FORM_TEXT ? item.label : formatValue(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="Export" showBack onBack={() => navigate(-1)}>
      <div className="p-6 space-y-8 animate-fade-up">
        <div>
          <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-4 ml-1">Choose Format</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'pdf', label: 'PDF', icon: 'description' },
              { id: 'whatsapp', label: 'WhatsApp', icon: 'chat_bubble' },
              { id: 'docx', label: 'DOCX', icon: 'article' },
              { id: 'csv', label: 'CSV', icon: 'table_rows' }
            ].map((fmt, idx) => (
              <button 
                key={fmt.id}
                onClick={() => setSelected(fmt.id as ExportFormat)}
                className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] border-2 transition-all active:scale-95 animate-fade-up stagger-${(idx % 5) + 1} ${selected === fmt.id ? 'border-primary bg-primary/10 shadow-xl shadow-primary/10 ring-4 ring-primary/5' : 'border-border-slate bg-surface hover:bg-white/5'}`}
              >
                <span className={`material-symbols-outlined text-4xl transition-all ${selected === fmt.id ? 'text-primary font-bold scale-110' : 'text-white/20'}`}>{fmt.icon}</span>
                <div className="text-center">
                  <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${selected === fmt.id ? 'text-primary' : 'text-white/40'}`}>{fmt.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => setShowPreview(true)}
          className="w-full bg-primary text-background py-5 rounded-3xl font-bold text-xs uppercase tracking-[0.4em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-primary-hover shadow-[0_10px_30px_rgba(74,222,128,0.2)]"
        >
          <span className="material-symbols-outlined">visibility</span>
          Preview
        </button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-surface rounded-[3rem] p-8 shadow-2xl animate-scale-in flex flex-col max-h-[92vh] border-2 border-primary/20">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">
                PREVIEW: {selected.toUpperCase()}
              </h4>
              <button onClick={() => setShowPreview(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-accent text-white/50 hover:bg-white/5 active:scale-90 transition-all">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <PreviewContent />
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button 
                onClick={selected === 'whatsapp' ? copyWhatsApp : handleExportAction}
                className="w-full bg-primary text-background py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-primary/20 hover:bg-primary-hover"
              >
                <span className="material-symbols-outlined">{selected === 'whatsapp' ? 'content_copy' : 'download'}</span>
                {selected === 'whatsapp' ? 'Copy Text' : `Generate ${selected.toUpperCase()}`}
              </button>
              <button 
                onClick={() => setShowPreview(false)}
                className="w-full py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-white/40 hover:bg-white/5 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
