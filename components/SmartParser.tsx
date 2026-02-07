
import React, { useState, useRef } from 'react';

interface SmartParserProps {
  onParse: (text?: string, image?: { data: string, mimeType: string }) => void;
  isProcessing: boolean;
}

const SmartParser: React.FC<SmartParserProps> = ({ onParse, isProcessing }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextParse = () => {
    if (!text.trim()) return;
    onParse(text);
    setText('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onParse(undefined, { data: base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 p-5 text-white">
        <h3 className="text-sm font-black uppercase italic tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          Import Rapido Airbnb
        </h3>
      </div>
      <div className="p-6">
        <div className="flex gap-3 mb-4">
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex-1 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-100 flex items-center justify-center gap-2"
            >
                📷 Foto Documento
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
            />
        </div>

        <textarea 
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Incolla qui la chat di Airbnb o l'email..."
          rows={6}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
        
        <button 
          onClick={handleTextParse}
          disabled={isProcessing || !text.trim()}
          className="mt-4 w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-slate-900 transition-all disabled:opacity-50"
        >
          {isProcessing ? 'Analisi in corso...' : 'Estrai Dati Ospite'}
        </button>
        <p className="mt-4 text-[9px] text-slate-400 text-center font-bold uppercase">L'IA identificherà automaticamente nomi, date e documenti.</p>
      </div>
    </div>
  );
};

export default SmartParser;
