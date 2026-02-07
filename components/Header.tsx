
import React from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
  pendingCount: number;
  isCloudSyncing?: boolean;
  activeTab: 'dashboard' | 'history' | 'integration';
  onTabChange: (tab: 'dashboard' | 'history' | 'integration') => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, pendingCount, isCloudSyncing, activeTab, onTabChange }) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 h-20 border-b border-slate-800">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-700 p-2 rounded-lg shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white">The Corner <span className="text-indigo-400 italic">Hub</span></h1>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] uppercase tracking-[0.2em] text-slate-400 font-bold">Sync Pro Active</span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700">
            <button 
              onClick={() => onTabChange('dashboard')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Lavorazione {pendingCount > 0 && <span className="ml-2 bg-rose-500 text-white px-1.5 py-0.5 rounded-md text-[8px]">{pendingCount}</span>}
            </button>
            <button 
              onClick={() => onTabChange('history')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Registro Alloggiati
            </button>
            <button 
              onClick={() => onTabChange('integration')}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'integration' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Configurazione
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${isCloudSyncing ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-500'}`}></div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              {isCloudSyncing ? 'Syncing...' : 'System Online'}
            </span>
          </div>
          
          <button 
            onClick={onSettingsClick}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors relative group border border-transparent hover:border-slate-700"
          >
            <svg className="w-5 h-5 text-slate-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
