
import React from 'react';
import { GuestData, RegistrationStatus } from '../types';

interface GuestCardProps {
  guest: GuestData;
  onRegister: () => void;
  onDelete: () => void;
}

const GuestCard: React.FC<GuestCardProps> = ({ guest, onRegister, onDelete }) => {
  const isPending = guest.status === RegistrationStatus.PENDING;

  const getStatusDisplay = () => {
    switch (guest.status) {
      case RegistrationStatus.SUCCESS:
        return <div className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-[10px] font-black border border-emerald-200 uppercase tracking-wider">Inviato ✅</div>;
      case RegistrationStatus.ERROR:
        return <div className="text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-[10px] font-black border border-red-200 uppercase tracking-wider">Errore ❌</div>;
      case RegistrationStatus.VALIDATING:
        return <div className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-[10px] font-black border border-blue-200 animate-pulse uppercase">Inviando...</div>;
      default:
        return <div className="text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-black border border-slate-200 uppercase">Da Verificare</div>;
    }
  };

  return (
    <div className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${isPending ? 'border-indigo-100 shadow-indigo-50/50' : 'border-slate-100'}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black italic ${guest.source?.includes('Airbnb') ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white'}`}>
              {guest.firstName?.[0]}{guest.lastName?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xl font-black text-slate-900 tracking-tight">{guest.firstName} {guest.lastName}</h4>
                {guest.reservationCode && (
                   <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-black border border-rose-100">{guest.reservationCode}</span>
                )}
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded text-slate-500 border border-slate-200">{guest.source}</span>
                <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded text-indigo-600 border border-indigo-100">{guest.citizenship || 'Naz. Sconosciuta'}</span>
              </div>
            </div>
          </div>
          {getStatusDisplay()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 py-6 border-y border-slate-50">
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dati Soggiorno</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-800">{guest.arrivalDate || '---'}</p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{guest.stayDays} Notti</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nascita</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-800">{guest.birthPlace || 'Luogo non rilevato'}</p>
                <p className="text-[10px] font-medium text-slate-500">{guest.birthDate || 'Data mancante'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Documento Identità</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-sm font-bold text-slate-800 uppercase">{guest.documentType || 'Tipo N.D.'}</p>
                <p className="text-[10px] font-black text-slate-600">{guest.documentNumber || 'Numero mancante'}</p>
                <p className="text-[9px] text-slate-400 mt-1 italic leading-tight">Rilascio: {guest.documentIssuePlace || 'Non rilevato'}</p>
              </div>
            </div>
          </div>
        </div>

        {guest.errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] text-red-700 font-bold flex gap-3 items-center">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {guest.errorMessage}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button onClick={onDelete} className="text-[10px] font-black uppercase text-slate-300 hover:text-red-500 transition-colors tracking-widest flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             Elimina Scheda
          </button>

          {isPending && (
            <button 
              onClick={onRegister}
              className="bg-indigo-600 hover:bg-black text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center gap-3"
            >
              Invia ad Alloggiati Web
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestCard;
