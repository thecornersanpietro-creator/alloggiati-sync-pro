
import React from 'react';

const IntegrationGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mb-6">Guida all'Accesso & Deploy</h2>
        
        <div className="p-6 bg-indigo-50 border-2 border-indigo-200 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="font-black text-indigo-900 uppercase text-xs tracking-wider">Link di Accesso Pubblici</h3>
          </div>
          <p className="text-sm text-indigo-800 mb-4">
            L'indirizzo che hai provato a usare non è un dominio valido. Firebase Hosting pubblica la tua app ai seguenti URL:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <a 
              href="https://thecornersanpietro-creator.web.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex justify-between items-center p-4 bg-white rounded-2xl border border-indigo-100 hover:border-indigo-600 transition-all shadow-sm"
            >
              <span className="font-mono text-xs text-indigo-600 font-bold">https://thecornersanpietro-creator.web.app</span>
              <svg className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a 
              href="https://thecornersanpietro-creator.firebaseapp.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex justify-between items-center p-4 bg-white rounded-2xl border border-indigo-100 hover:border-indigo-600 transition-all shadow-sm"
            >
              <span className="font-mono text-xs text-indigo-600 font-bold">https://thecornersanpietro-creator.firebaseapp.com</span>
              <svg className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-black text-slate-900 uppercase text-xs mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              Risoluzione Errore DNS
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              L'errore <strong>NXDOMAIN</strong> accade perché <code>thecornersanpietro-creator</code> da solo è considerato un nome di computer locale. Assicurati di aggiungere sempre il suffisso <code>.web.app</code> alla fine dell'indirizzo.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-black text-slate-900 uppercase text-xs mb-3 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
               Aggiornamento tramite GitHub
            </h4>
            <p className="text-sm text-slate-600 mb-4">
              Per rendere effettive le modifiche sul sito pubblico, assicurati che il repository GitHub sia collegato correttamente e che il "Secret" sia impostato:
            </p>
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
