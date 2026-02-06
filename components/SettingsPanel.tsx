
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
  onClose: () => void;
  onResetSync?: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onClose, onResetSync }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const save = () => {
    onUpdate(localSettings);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-indigo-900 p-4 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Configurazione Hub
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-6 space-y-6 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">User Code</label>
            <input 
              type="text"
              value={localSettings.userCode}
              onChange={e => setLocalSettings({...localSettings, userCode: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Password</label>
            <input 
              type="password"
              value={localSettings.password}
              onChange={e => setLocalSettings({...localSettings, password: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Opzioni Sincronizzazione</label>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">Auto-Check Gmail</h4>
                  <p className="text-[10px] text-slate-500">Controlla nuove email ogni 6 ore.</p>
                </div>
                <button 
                  onClick={() => setLocalSettings({...localSettings, autoGmailCheck: !localSettings.autoGmailCheck})}
                  className={`w-10 h-5 rounded-full transition-colors relative ${localSettings.autoGmailCheck ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${localSettings.autoGmailCheck ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
             </div>

             <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-800">Giorni di Ricerca</h4>
                  <p className="text-[10px] text-slate-500">Filtra email degli ultimi X giorni.</p>
                </div>
                <select 
                  value={localSettings.searchDays}
                  onChange={e => setLocalSettings({...localSettings, searchDays: parseInt(e.target.value)})}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                >
                  <option value={1}>1 giorno</option>
                  <option value={3}>3 giorni</option>
                  <option value={7}>7 giorni</option>
                  <option value={14}>14 giorni</option>
                  <option value={30}>30 giorni</option>
                </select>
             </div>

             <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-800">Auto-Invio Portale</h4>
                  <p className="text-[10px] text-slate-500">Registra subito dopo l'importazione.</p>
                </div>
                <button 
                  onClick={() => setLocalSettings({...localSettings, autoSync: !localSettings.autoSync})}
                  className={`w-10 h-5 rounded-full transition-colors relative ${localSettings.autoSync ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${localSettings.autoSync ? 'right-0.5' : 'left-0.5'}`}></div>
                </button>
             </div>

             <div className="pt-4 border-t border-slate-200">
                <button 
                  onClick={onResetSync}
                  className="w-full py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-amber-100 transition-all"
                >
                  Svuota Memoria Sincronizzazione
                </button>
                <p className="mt-2 text-[9px] text-slate-400 italic text-center">
                  Usa questo se l'app "non trova niente" ma ci sono email nuove.
                </p>
             </div>
          </div>
        </div>

        <button 
          onClick={save}
          className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-indigo-100"
        >
          Salva ed Esci
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
