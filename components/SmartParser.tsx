
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
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Importazione Intelligente Airbnb
        </h3>
      </div>
      <div className="p-5">
        <div className="flex gap-2 mb-4">
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="flex-1 py-3 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-black uppercase tracking-tighter flex items-center justify-center gap-2 transition-all border-2 border-dashed border-slate-300"
            >
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Scansiona Doc
            </button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                capture="environment" 
                onChange={handleFileChange}
            />
        </div>

        <p className="text-[10px] text-gray-500 mb-4 leading-tight">
          Incolla il testo della chat Airbnb o scatta una foto al documento dell'ospite.
        </p>
        <textarea 
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Incolla testo qui..."
          rows={5}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300"
        />
        <button 
          onClick={handleTextParse}
          disabled={isProcessing || !text.trim()}
          className={`mt-4 w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
            isProcessing || !text.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Analisi IA...
            </>
          ) : (
            <>Estrai Dati Ospite</>
          )}
        </button>
      </div>
    </div>
  );
};

export default SmartParser;
