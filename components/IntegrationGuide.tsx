
import React from 'react';

const IntegrationGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mb-6">Reset GitHub & Nuova Versione</h2>
        
        <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl mb-8">
          <p className="text-sm text-amber-800 font-bold">
            STATO: Progetto rinominato in "v2". 
          </p>
          <p className="text-xs text-amber-700 mt-2">
            Ora clicca l'icona GitHub nell'interfaccia di AI Studio e seleziona "Connect to GitHub". 
            Questo creerà un repository nuovo di zecca ignorando quello vecchio.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl">
            <h4 className="font-black text-indigo-600 uppercase text-xs mb-2">Configurazione GitHub Secrets</h4>
            <p className="text-sm text-slate-600 mb-4">Nel nuovo repository, vai in Settings > Secrets e aggiungi:</p>
            <div className="bg-slate-900 p-4 rounded-xl">
              <code className="text-indigo-400 font-bold text-xs">FIREBASE_SERVICE_ACCOUNT_THECORNERSANPIETRO_CREATOR</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;
