
import React, { useState } from 'react';
import { GuestData } from '../types';

interface HistoryListProps {
  history: GuestData[];
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(guest => {
    const searchStr = `${guest.firstName} ${guest.lastName} ${guest.alloggiatiId}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">Registro Alloggiati</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Registro fisso delle comunicazioni inviate correttamente alla Polizia di Stato
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text"
              placeholder="Cerca per nome o protocollo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={onClear}
            className="text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors tracking-widest whitespace-nowrap"
          >
            Svuota Registro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Data Invio</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ospite & Nazionalità</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Soggiorno</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Documento Identità</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Protocollo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        {searchTerm ? 'Nessun risultato trovato' : 'Il registro è vuoto'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((guest) => (
                  <tr key={guest.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-[10px] font-black text-slate-400 uppercase leading-none">{guest.sentAt?.split(',')[0]}</p>
                      <p className="text-[9px] font-bold text-indigo-500 mt-1">{guest.sentAt?.split(',')[1]}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {guest.firstName[0]}{guest.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 leading-tight uppercase">{guest.firstName} {guest.lastName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{guest.citizenship}</span>
                            <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded uppercase font-bold">{guest.source}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <p className="text-xs font-bold text-slate-700">{guest.arrivalDate}</p>
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{guest.stayDays} Notti</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 inline-block min-w-[140px]">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{guest.documentType}</p>
                        <p className="text-[10px] font-black text-slate-700 font-mono">{guest.documentNumber}</p>
                        <p className="text-[8px] text-slate-400 font-bold mt-1">Nato a: {guest.birthPlace}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <div className="inline-flex flex-col items-end">
                        <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg shadow-emerald-100 flex items-center gap-2 border border-emerald-400">
                          {guest.alloggiatiId}
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        {guest.reservationCode && (
                          <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Booking ID: {guest.reservationCode}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryList;
