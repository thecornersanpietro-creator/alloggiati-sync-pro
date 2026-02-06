
import React, { useState } from 'react';

const IntegrationGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-slate-900 p-10 rounded-3xl text-white shadow-2xl">
        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Guida al <span className="text-indigo-400">Successo</span></h3>
        <p className="text-slate-400 mt-4 font-medium">Se vedi questa pagina, l'app è online. Ora assicurati che i dati fluiscano correttamente.</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          <h4 className="font-black uppercase text-indigo-600 mb-4">1. GitHub Secrets</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Assicurati di aver aggiunto <code>FIREBASE_SERVICE_ACCOUNT_ALLOGGIATI_SYNC_PRO</code> nei <b>Settings > Secrets</b> del tuo repository.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          <h4 className="font-black uppercase text-indigo-600 mb-4">2. File Obbligatori</h4>
          <p className="text-sm text-slate-600">Il tuo repository deve contenere:</p>
          <ul className="mt-4 space-y-2 text-xs font-mono bg-slate-50 p-4 rounded-xl">
            <li>✅ index.html (Root)</li>
            <li>✅ firebase.json (Root)</li>
            <li>✅ .github/workflows/deploy.yml</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntegrationGuide;
