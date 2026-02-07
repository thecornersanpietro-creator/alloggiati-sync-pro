
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GuestData, RegistrationStatus, AppSettings, GuestType } from './types.ts';
import { sanitizeGuestData } from './services/geminiService.ts';
import { sendToAlloggiati } from './services/alloggiatiService.ts';
import Dashboard from './components/Dashboard.tsx';
import Header from './components/Header.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import SmartParser from './components/SmartParser.tsx';
import IntegrationGuide from './components/IntegrationGuide.tsx';
import HistoryList from './components/HistoryList.tsx';

const PERMANENT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwdPlvr43FL1FT9yLt112iHilBpRZSYss9s1Hy_gyr30qsaLqH55aHeQZVi3G1mlCtk/exec';
const REQUEST_DELAY_MS = 4500; 

const DEFAULT_SETTINGS: AppSettings = {
  wsKey: '', 
  userCode: '',
  password: '',
  propertyId: 'THE-CORNER-SAN-PIETRO',
  autoSync: false,
  autoGmailCheck: true, 
  sheetCsvUrl: PERMANENT_SCRIPT_URL,
  searchDays: 2 
};

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // FIX: Added readonly to match environment's existing Window interface definition and fix modifier mismatch error
    readonly aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'integration'>('dashboard');
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [history, setHistory] = useState<GuestData[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    return DEFAULT_SETTINGS;
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [quotaError, setQuotaError] = useState(false);
  
  const processedTimestamps = useRef<Set<string>>(new Set());

  useEffect(() => {
    const savedGuests = localStorage.getItem('guests');
    if (savedGuests) setGuests(JSON.parse(savedGuests));
    
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedTimestamps = localStorage.getItem('processedTimestamps');
    if (savedTimestamps) processedTimestamps.current = new Set(JSON.parse(savedTimestamps));
  }, []);

  useEffect(() => {
    localStorage.setItem('guests', JSON.stringify(guests));
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('appSettings', JSON.stringify(settings));
    localStorage.setItem('processedTimestamps', JSON.stringify(Array.from(processedTimestamps.current)));
  }, [guests, history, settings]);

  const handleRegister = async (guestId: string) => {
    const targetGuest = guests.find(g => g.id === guestId);
    if (!targetGuest || targetGuest.status === RegistrationStatus.SUCCESS) return;

    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, status: RegistrationStatus.VALIDATING } : g));
    
    try {
      const result = await sendToAlloggiati(targetGuest, settings.wsKey);
      if (result.success) {
        const completedGuest = { 
          ...targetGuest, 
          status: RegistrationStatus.SUCCESS, 
          alloggiatiId: result.id,
          sentAt: new Date().toLocaleString('it-IT')
        };
        // Aggiungiamo allo storico (Registro Permanente)
        setHistory(prev => [completedGuest, ...prev]);
        // Rimuoviamo dalla Dashboard (Lavorazione)
        setGuests(prev => prev.filter(g => g.id !== guestId));
      } else {
        setGuests(current => current.map(g => {
          if (g.id === guestId) {
            return { ...g, status: RegistrationStatus.ERROR, errorMessage: result.error };
          }
          return g;
        }));
      }
    } catch (e) {
      setGuests(current => current.map(g => g.id === guestId ? { ...g, status: RegistrationStatus.ERROR, errorMessage: "Errore connessione portale" } : g));
    }
  };

  const updateGuest = (updated: GuestData) => {
    setGuests(prev => prev.map(g => g.id === updated.id ? updated : g));
  };

  const handleSmartParse = async (text?: string, image?: {data: string, mimeType: string}, source: string = "Manuale"): Promise<{success: boolean, guestId?: string}> => {
    setIsProcessing(true);
    setQuotaError(false);
    try {
      const sanitized = await sanitizeGuestData({ text, image });
      const newId = Math.random().toString(36).substr(2, 9);
      const newGuest: GuestData = {
        ...sanitized,
        id: newId,
        status: RegistrationStatus.PENDING,
        source: text?.toLowerCase().includes("airbnb") ? "Airbnb Chat" : source,
      } as GuestData;
      
      setGuests(prev => [newGuest, ...prev]);
      return { success: true, guestId: newId };
    } catch (error: any) {
      console.error("Parse Error:", error);
      // Handle quota exceeded and invalid key errors as per guidelines
      if (error.message === "QUOTA_EXCEEDED") {
        setQuotaError(true);
      } else if (error.message === "API_KEY_INVALID") {
        handleOpenKeySelector();
      } else {
        alert(error.message || "Errore nell'analisi. Riprova.");
      }
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenKeySelector = async () => {
    try {
      await window.aistudio.openSelectKey();
      setQuotaError(false);
    } catch (e) {
      console.error("Errore selettore chiave", e);
    }
  };

  const pollGmail = useCallback(async () => {
    if (isCloudSyncing) return;
    setIsCloudSyncing(true);
    try {
      const url = new URL(settings.sheetCsvUrl.trim());
      url.searchParams.set('days', settings.searchDays.toString());
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (Array.isArray(data)) {
        for (const email of data) {
          const emailId = `ID-${email.date}-${email.subject.length}`;
          if (!processedTimestamps.current.has(emailId)) {
            const result = await handleSmartParse(email.content, undefined, "Gmail");
            if (result.success) {
              processedTimestamps.current.add(emailId);
              if (settings.autoSync && result.guestId) handleRegister(result.guestId);
              await new Promise(r => setTimeout(r, REQUEST_DELAY_MS));
            }
          }
        }
      }
    } catch (e) {
      console.error("Sync error", e);
    } finally {
      setIsCloudSyncing(false);
    }
  }, [settings, isCloudSyncing, handleSmartParse, handleRegister]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        onSettingsClick={() => setShowSettings(!showSettings)} 
        pendingCount={guests.length} 
        isCloudSyncing={isCloudSyncing} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="bg-indigo-600 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center">
        <span>Stato Progetto: V2 AlloggiatiSync Pro</span>
        <span className="opacity-50 italic">The Corner Hub</span>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {quotaError && (
                <div className="mb-6 p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl animate-fade-in">
                   <div className="flex gap-4 items-start">
                      <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-amber-900 uppercase text-xs tracking-wider">Limite Quota Gratuita Raggiunto</h3>
                        <p className="text-sm text-amber-800 mt-1">Hai esaurito i crediti gratuiti giornalieri di Google. Per continuare, devi collegare la tua chiave API personale.</p>
                        <div className="mt-4 flex gap-3">
                          <button onClick={handleOpenKeySelector} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Collega Mia Chiave API</button>
                          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-amber-700 underline text-[10px] font-bold py-2">Guida alla Fatturazione</a>
                        </div>
                      </div>
                   </div>
                </div>
              )}
              <Dashboard 
                guests={guests} 
                onRegister={handleRegister} 
                onDelete={id => setGuests(g => g.filter(x => x.id !== id))} 
                onUpdate={updateGuest}
                isProcessing={isProcessing} 
                onManualSync={pollGmail} 
                isSyncing={isCloudSyncing} 
                searchDays={settings.searchDays} 
              />
            </div>
            <div className="space-y-6">
              <SmartParser onParse={handleSmartParse} isProcessing={isProcessing} />
              {showSettings && (
                <SettingsPanel 
                  settings={settings} 
                  onUpdate={s => setSettings(prev => ({...prev, ...s}))} 
                  onClose={() => setShowSettings(false)} 
                  onOpenKeySelector={handleOpenKeySelector}
                  onResetSync={() => {
                    processedTimestamps.current = new Set();
                    alert("Memoria sincronizzazione Gmail svuotata.");
                  }}
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryList 
            history={history} 
            onClear={() => {
              if (confirm("Vuoi davvero svuotare tutto il registro storico? Questa operazione è irreversibile.")) setHistory([]);
            }} 
          />
        )}

        {activeTab === 'integration' && <IntegrationGuide />}
      </main>
    </div>
  );
};

export default App;
