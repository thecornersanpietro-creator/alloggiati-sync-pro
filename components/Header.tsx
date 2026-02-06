
import React from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
  pendingCount: number;
  isCloudSyncing?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, pendingCount, isCloudSyncing }) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AlloggiatiSync <span className="text-blue-400">Pro</span></h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
              Automazione Attiva
              {isCloudSyncing && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isCloudSyncing ? 'bg-blue-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
              {isCloudSyncing ? 'Sincronizzazione...' : 'Live Cloud'}
            </span>
          </div>
          
          <button 
            onClick={onSettingsClick}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors relative group"
          >
            <svg className="w-6 h-6 text-slate-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
