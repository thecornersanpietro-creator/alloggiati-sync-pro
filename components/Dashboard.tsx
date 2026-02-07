
import React from 'react';
import { GuestData } from '../types.ts';
import GuestCard from './GuestCard.tsx';

interface DashboardProps {
  guests: GuestData[];
  onRegister: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (updated: GuestData) => void;
  isProcessing: boolean;
  onManualSync: () => void;
  isSyncing: boolean;
  searchDays: number;
}

const Dashboard: React.FC<DashboardProps> = ({ guests, onRegister, onDelete, onUpdate, isProcessing, onManualSync, isSyncing, searchDays }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">The Corner Hub</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {isSyncing ? 'Sincronizzazione in corso...' : `Pronto • Ultimi ${searchDays} giorni`}
          </p>
        </div>
        <button 
          onClick={onManualSync} 
          disabled={isSyncing}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-50"
        >
          Sincronizza Gmail
        </button>
      </div>

      <div className="grid gap-6">
        {guests.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-3xl py-20 text-center">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nessun ospite in lista</p>
            <p className="text-[9px] text-slate-300 mt-2">Incolla una chat o scansiona un documento</p>
          </div>
        ) : (
          guests.map(guest => (
            <GuestCard 
              key={guest.id} 
              guest={guest} 
              onRegister={() => onRegister(guest.id)} 
              onDelete={() => onDelete(guest.id)} 
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
