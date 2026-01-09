
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FormTemplate, FormField, FieldType, TextStyle, PriorityLevel, Schedule, Recipient } from '../types';

interface BuilderProps {
  onSave: (template: FormTemplate) => void;
  templates: FormTemplate[];
}

export const Builder: React.FC<BuilderProps> = ({ onSave, templates }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState('New Form');
  const [fields, setFields] = useState<FormField[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [priority, setPriority] = useState<PriorityLevel>(PriorityLevel.ROUTINE);
  const [recipientName, setRecipientName] = useState('');
  const [recipientImage, setRecipientImage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [scheduleFreq, setScheduleFreq] = useState<Schedule['frequency']>('Daily');
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (id) {
      const existing = templates.find(t => String(t.id) === String(id));
      if (existing) {
        setTitle(existing.title);
        setFields(existing.fields);
        setCoverImage(existing.image || '');
        setPriority(existing.priority || PriorityLevel.ROUTINE);
        setRecipientName(existing.recipient?.name || '');
        setRecipientImage(existing.recipient?.image || '');
        setScheduleTime(existing.schedule?.time || '12:00');
        setScheduleFreq(existing.schedule?.frequency || 'Daily');
      }
    }
  }, [id, templates]);

  const handleSave = () => {
    const newTpl: FormTemplate = {
      id: id || `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: title,
      fields,
      image: coverImage || `https://picsum.photos/seed/${id || Date.now()}/400/300?grayscale`,
      lastEdited: new Date().toLocaleDateString(),
      icon: 'description',
      priority,
      recipient: recipientName ? { name: recipientName, image: recipientImage } : undefined,
      schedule: { time: scheduleTime, frequency: scheduleFreq }
    };
    onSave(newTpl);
    navigate('/');
  };

  const addField = (type: FieldType) => {
    setFields([...fields, {
      id: `f-${Date.now()}-${fields.length}-${Math.random().toString(36).substr(2, 5)}`,
      label: '', 
      description: '',
      type,
      required: false,
      labelStyle: { bold: false, italic: false },
      inputStyle: { bold: false, italic: false }
    }]);
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter(f => f.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  };

  const setStyle = (fieldId: string, target: 'labelStyle' | 'inputStyle', bold: boolean, italic: boolean) => {
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, [target]: { bold, italic } } : f));
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newFields = [...fields];
    const item = newFields.splice(draggedIndex, 1)[0];
    newFields.splice(index, 0, item);
    setDraggedIndex(index);
    setFields(newFields);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  const randomizeImage = () => {
    setCoverImage(`https://picsum.photos/seed/${Math.random().toString(36).substr(2, 5)}/800/600`);
  };

  const priorityOptions = [
    { level: PriorityLevel.FLASH, color: 'text-red-500' },
    { level: PriorityLevel.IMMEDIATE, color: 'text-orange-500' },
    { level: PriorityLevel.PRIORITY, color: 'text-yellow-500' },
    { level: PriorityLevel.ROUTINE, color: 'text-primary' },
  ];

  return (
    <Layout 
      title={title} 
      showBack 
      onBack={() => navigate('/')}
      actions={
        <button onClick={handleSave} className="bg-primary text-background font-bold text-[10px] px-5 uppercase tracking-widest rounded-xl py-2.5 transition-all shadow-md active:scale-95 hover:bg-primary-hover">Save</button>
      }
    >
      <div className="p-5 space-y-6 pb-44 animate-fade-up">
        {/* Metadata Section */}
        <section className="bg-surface-accent/30 p-4 rounded-3xl border border-border-slate/50 space-y-5">
           <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest">Template Configuration</h3>
           
           <div className="space-y-2">
             <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] ml-1">Priority Status</label>
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
               {priorityOptions.map((opt) => (
                 <button 
                   key={opt.level} 
                   onClick={() => setPriority(opt.level)}
                   className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest border transition-all ${priority === opt.level ? `bg-surface border-primary ${opt.color}` : 'bg-background/50 border-border-slate text-white/40'}`}
                 >
                   {opt.level}
                 </button>
               ))}
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] ml-1">Recipient Name</label>
                <input 
                  type="text" 
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-background/50 rounded-xl p-3 text-xs text-white border-none ring-1 ring-border-slate focus:ring-primary/50"
                  placeholder="e.g. Head Office"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] ml-1">Schedule Time</label>
                <input 
                  type="time" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-background/50 rounded-xl p-3 text-xs text-white border-none ring-1 ring-border-slate focus:ring-primary/50"
                />
              </div>
           </div>
        </section>

        {/* Cover Image Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] ml-1">Cover Image</label>
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-background/50 border-2 border-dashed border-border-slate hover:border-primary/50 transition-all group">
            {coverImage ? (
              <>
                <img src={coverImage} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => setShowImageModal(true)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:text-background transition-all">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => setCoverImage('')} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-all">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => setShowImageModal(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                <span className="text-[10px] font-bold uppercase">Add Form Cover</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] ml-1">Form Title</label>
          <input 
            className="w-full bg-background/50 rounded-2xl p-4 text-lg font-bold border-none ring-2 ring-border-slate focus:ring-4 focus:ring-primary/20 text-white transition-all"
            value={title}
            placeholder="e.g. Project Status Form"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
             <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fields</h3>
             <span className="text-[9px] bg-primary/10 px-2.5 py-1 rounded-full text-primary font-bold border border-primary/20">{fields.length} ITEMS</span>
           </div>

           {fields.map((field, index) => (
             <div 
                key={field.id} 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative bg-surface-accent p-5 rounded-3xl shadow-sm border-2 ${draggedIndex === index ? 'opacity-50 border-primary scale-[0.98]' : 'border-border-slate'} space-y-4 transition-all hover:shadow-lg cursor-grab active:cursor-grabbing animate-scale-in`}
             >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white/30">drag_indicator</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Label Style</span>
                         <div className="flex gap-1 bg-background/50 p-1 rounded-lg">
                           {[{b:false, i:false, l:'N'}, {b:true, i:false, l:'B'}, {b:false, i:true, l:'I'}].map((s, idx) => (
                             <button 
                               key={idx}
                               onClick={() => setStyle(field.id, 'labelStyle', s.b, s.i)}
                               className={`w-6 h-6 flex items-center justify-center rounded text-[9px] font-bold border transition-all ${field.labelStyle?.bold === s.b && field.labelStyle?.italic === s.i ? 'bg-primary text-background border-primary shadow-sm' : 'text-white/30 border-transparent hover:bg-white/5'}`}
                             >{s.l}</button>
                           ))}
                         </div>
                      </div>
                      <input 
                        className={`text-sm bg-transparent border-none p-0 focus:ring-0 w-full text-white placeholder:text-white/20 ${field.labelStyle?.bold ? 'font-black' : 'font-bold'} ${field.labelStyle?.italic ? 'italic' : ''}`} 
                        placeholder={field.type === FieldType.FORM_TEXT ? "Information text..." : "Field Label"}
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                      />
                    </div>
                    
                    {field.type !== FieldType.FORM_TEXT && (
                      <div className="space-y-2 border-t border-border-slate/50 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Input Style</span>
                          <div className="flex gap-1 bg-background/50 p-1 rounded-lg">
                             {[{b:false, i:false, l:'N'}, {b:true, i:false, l:'B'}, {b:false, i:true, l:'I'}].map((s, idx) => (
                               <button 
                                 key={idx}
                                 onClick={() => setStyle(field.id, 'inputStyle', s.b, s.i)}
                                 className={`w-6 h-6 flex items-center justify-center rounded text-[9px] font-bold border transition-all ${field.inputStyle?.bold === s.b && field.inputStyle?.italic === s.i ? 'bg-primary text-background border-primary shadow-sm' : 'text-white/30 border-transparent hover:bg-white/5'}`}
                               >{s.l}</button>
                             ))}
                          </div>
                        </div>
                        <textarea 
                          className="text-[10px] text-white bg-background/30 border border-border-slate rounded-xl p-3 focus:ring-2 focus:ring-primary/20 w-full min-h-[50px] placeholder:text-white/20 font-bold" 
                          placeholder="Instructions (optional)..."
                          value={field.description || ''}
                          onChange={(e) => updateField(field.id, { description: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                  <button onClick={() => removeField(field.id)} className="p-2.5 text-white/20 hover:text-red-400 transition-all bg-background/30 rounded-xl">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border-slate/50">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] px-2.5 py-1 rounded-full font-bold uppercase tracking-[0.1em] border ${field.type === FieldType.FORM_TEXT ? 'bg-amber-900/30 text-amber-400 border-amber-800/50' : 'bg-primary/5 text-primary border-primary/20'}`}>
                      {field.type}
                    </span>
                    {field.type !== FieldType.FORM_TEXT && (
                      <button 
                        onClick={() => updateField(field.id, { required: !field.required })}
                        className={`text-[8px] px-2.5 py-1 rounded-full font-bold uppercase tracking-[0.1em] border transition-all ${field.required ? 'bg-red-950/30 text-red-400 border-red-900/50' : 'bg-background/50 text-white/30 border-border-slate'}`}
                      >
                        {field.required ? 'REQUIRED' : 'OPTIONAL'}
                      </button>
                    )}
                  </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-[400px] bg-surface rounded-[2.5rem] p-8 shadow-2xl animate-scale-in border border-border-slate">
            <h4 className="text-xl font-bold text-white mb-4 text-center uppercase tracking-tight text-white">Set Cover Image</h4>
            <div className="space-y-4">
              <input 
                type="text" 
                className="w-full bg-background/50 rounded-2xl p-4 text-sm text-white border-none ring-1 ring-border-slate focus:ring-2 focus:ring-primary/50"
                placeholder="Image URL (e.g. https://...)"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
              <div className="flex gap-2">
                <button 
                  onClick={randomizeImage}
                  className="flex-1 py-4 bg-surface-accent text-primary font-bold text-xs uppercase tracking-widest rounded-2xl border border-primary/20 hover:bg-primary/10 transition-all"
                >
                  Randomize
                </button>
                <button 
                  onClick={() => setShowImageModal(false)}
                  className="flex-1 py-4 bg-primary text-background font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface/95 backdrop-blur-md border-t-2 border-border-slate p-4 pb-10 z-30 shadow-2xl">
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 px-2">
              {[
                  { name: 'TEXT', icon: 'text_fields', type: FieldType.SHORT_TEXT },
                  { name: 'INFO', icon: 'description', type: FieldType.FORM_TEXT },
                  { name: 'DATE', icon: 'calendar_today', type: FieldType.DATE },
                  { name: 'IMAGE', icon: 'photo_camera', type: FieldType.IMAGE },
                  { name: 'SIGN', icon: 'ink_pen', type: FieldType.SIGNATURE }
              ].map((tool) => (
                  <button key={tool.name} onClick={() => addField(tool.type)} className="flex flex-col items-center gap-2 group min-w-[76px] active:scale-90 transition-all">
                      <div className="w-14 h-14 rounded-2xl bg-surface-accent border-2 border-border-slate flex items-center justify-center text-white/30 group-hover:bg-primary group-hover:text-background group-hover:border-primary transition-all shadow-sm">
                          <span className="material-symbols-outlined text-2xl font-bold">{tool.icon}</span>
                      </div>
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest group-hover:text-primary transition-colors">{tool.name}</span>
                  </button>
              ))}
          </div>
      </div>
    </Layout>
  );
};
