
import React, { useState } from 'react';
import { GuestData, RegistrationStatus } from '../types';

interface GuestCardProps {
  guest: GuestData;
  onRegister: () => void;
  onDelete: () => void;
  onUpdate?: (updated: GuestData) => void;
}

const GuestCard: React.FC<GuestCardProps> = ({ guest, onRegister, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<GuestData>(guest);

  const isPending = guest.status === RegistrationStatus.PENDING;

  const handleSave = () => {
    if (onUpdate) onUpdate(editData);
    setIsEditing(false);
  };

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
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black italic shrink-0 ${guest.source?.includes('Airbnb') ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white'}`}>
              {guest.firstName?.[0]}{guest.lastName?.[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input className="text-sm font-bold border rounded px-2 py-1 w-32" value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} />
                    <input className="text-sm font-bold border rounded px-2 py-1 w-32" value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} />
                  </div>
                ) : (
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">{guest.firstName} {guest.lastName}</h4>
                )}
                {guest.reservationCode && !isEditing && (
                   <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-black border border-rose-100">{guest.reservationCode}</span>
                )}
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded text-slate-500 border border-slate-200">{guest.source}</span>
                {isEditing ? (
                   <input className="text-[9px] font-black uppercase border rounded px-2 py-0.5 w-32" value={editData.citizenship} onChange={e => setEditData({...editData, citizenship: e.target.value})} />
                ) : (
                   <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded text-indigo-600 border border-indigo-100">{guest.citizenship || 'Naz. Sconosciuta'}</span>
                )}
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
                {isEditing ? (
                  <input type="date" className="text-sm font-bold w-full bg-transparent" value={editData.arrivalDate} onChange={e => setEditData({...editData, arrivalDate: e.target.value})} />
                ) : (
                  <p className="text-sm font-bold text-slate-800">{guest.arrivalDate || '---'}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                   {isEditing ? (
                     <input type="number" className="text-[10px] font-bold w-12 border rounded" value={editData.stayDays} onChange={e => setEditData({...editData, stayDays: parseInt(e.target.value)})} />
                   ) : (
                     <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{guest.stayDays} Notti</p>
                   )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nascita</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                {isEditing ? (
                   <input className="text-sm font-bold w-full border rounded mb-1" value={editData.birthPlace} onChange={e => setEditData({...editData, birthPlace: e.target.value})} />
                ) : (
                   <p className="text-sm font-bold text-slate-800">{guest.birthPlace || 'Luogo non rilevato'}</p>
                )}
                {isEditing ? (
                   <input type="date" className="text-[10px] font-medium w-full border rounded" value={editData.birthDate} onChange={e => setEditData({...editData, birthDate: e.target.value})} />
                ) : (
                   <p className="text-[10px] font-medium text-slate-500">{guest.birthDate || 'Data mancante'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Documento Identità</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                {isEditing ? (
                  <select className="text-sm font-bold w-full border rounded mb-1" value={editData.documentType} onChange={e => setEditData({...editData, documentType: e.target.value})}>
                    <option value="CARTA DI IDENTITA">CARTA DI IDENTITA</option>
                    <option value="PASSAPORTO">PASSAPORTO</option>
                    <option value="PATENTE">PATENTE</option>
                  </select>
                ) : (
                  <p className="text-sm font-bold text-slate-800 uppercase">{guest.documentType || 'Tipo N.D.'}</p>
                )}
                {isEditing ? (
                  <input className="text-[10px] font-black w-full border rounded" value={editData.documentNumber} onChange={e => setEditData({...editData, documentNumber: e.target.value})} />
                ) : (
                  <p className="text-[10px] font-black text-slate-600">{guest.documentNumber || 'Numero mancante'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {guest.errorMessage && !isEditing && (
          <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] text-red-700 font-bold flex gap-3 items-center">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {guest.errorMessage}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-4">
            <button onClick={onDelete} className="text-[10px] font-black uppercase text-slate-300 hover:text-red-500 transition-colors tracking-widest flex items-center gap-2">
               Elimina
            </button>
            {isEditing ? (
              <button onClick={handleSave} className="text-[10px] font-black uppercase text-emerald-600 hover:text-emerald-700 transition-colors tracking-widest flex items-center gap-2">
                 ✅ Salva Modifiche
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-600 transition-colors tracking-widest flex items-center gap-2">
                 ✏️ Modifica Dati
              </button>
            )}
          </div>

          {isPending && !isEditing && (
            <button 
              onClick={onRegister}
              className="bg-indigo-600 hover:bg-black text-white px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center gap-3"
            >
              Invia ad Alloggiati Web
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestCard;
