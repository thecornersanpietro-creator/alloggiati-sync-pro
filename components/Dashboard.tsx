
import React from 'react';
import { GuestData, RegistrationStatus } from '../types.ts';
import GuestCard from './GuestCard.tsx';

interface DashboardProps {
  guests: GuestData[];
  onRegister: (id: string) => void;
  onDelete: (id: string) => void;
  isProcessing: boolean;
  onManualSync: () => void;
  isSyncing: boolean;
  searchDays: number;
}

const Dashboard: React.FC<DashboardProps> = ({ guests, onRegister, onDelete, isProcessing, onManualSync, isSyncing, searchDays }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic">The Corner Hub</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ricerca attiva: {searchDays} giorni</p>
        </div>
        <button 
          onClick={onManualSync} 
          disabled={isSyncing}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-50"
        >
          {isSyncing ? 'Sincronizzazione...' : 'Sincronizza Ora'}
        </button>
      </div>

      <div className="grid gap-6">
        {guests.length === 0 ? (
          <div className="bg-white border-2 border-dashed rounded-3xl py-20 text-center text-slate-400">
            Nessun ospite trovato. Clicca sincronizza o importa manualmente.
          </div>
        ) : (
          guests.map(guest => <GuestCard key={guest.id} guest={guest} onRegister={() => onRegister(guest.id)} onDelete={() => onDelete(guest.id)} />)
        )}
      </div>
    </div>
  );
};

export default Dashboard;
