
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GuestData, RegistrationStatus, AppSettings, GuestType } from './types.ts';
import { sanitizeGuestData } from './services/geminiService.ts';
import { sendToAlloggiati } from './services/alloggiatiService.ts';
import Dashboard from './components/Dashboard.tsx';
import Header from './components/Header.tsx';
import SettingsPanel from './components/SettingsPanel.tsx';
import SmartParser from './components/SmartParser.tsx';
import IntegrationGuide from './components/IntegrationGuide.tsx';

const PERMANENT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwdPlvr43FL1FT9yLt112iHilBpRZSYss9s1Hy_gyr30qsaLqH55aHeQZVi3G1mlCtk/exec';
const REQUEST_DELAY_MS = 4500; 

const DEFAULT_SETTINGS: AppSettings = {
  wsKey: '', // Da inserire nelle impostazioni dell'app
  userCode: '',
  password: '',
  propertyId: 'THE-CORNER-HUB',
  autoSync: true,
  autoGmailCheck: true, 
  sheetCsvUrl: PERMANENT_SCRIPT_URL,
  searchDays: 3 
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'integration'>('dashboard');
  const [guests, setGuests] = useState<GuestData[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
    return DEFAULT_SETTINGS;
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{current: number, total: number, waitSeconds?: number} | null>(null);
  
  const processedTimestamps = useRef<Set<string>>(new Set());

  useEffect(() => {
    const savedGuests = localStorage.getItem('guests');
    if (savedGuests) setGuests(JSON.parse(savedGuests));
    
    const savedTimestamps = localStorage.getItem('processedTimestamps');
    if (savedTimestamps) processedTimestamps.current = new Set(JSON.parse(savedTimestamps));
  }, []);

  useEffect(() => {
    localStorage.setItem('guests', JSON.stringify(guests));
    localStorage.setItem('appSettings', JSON.stringify(settings));
    localStorage.setItem('processedTimestamps', JSON.stringify(Array.from(processedTimestamps.current)));
  }, [guests, settings]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleRegister = async (guestId: string) => {
    const targetGuest = guests.find(g => g.id === guestId);
    if (!targetGuest || targetGuest.status === RegistrationStatus.SUCCESS) return;

    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, status: RegistrationStatus.VALIDATING } : g));
    
    try {
      const result = await sendToAlloggiati(targetGuest, settings.wsKey);
      setGuests(current => current.map(g => {
        if (g.id === guestId) {
          return result.success 
            ? { ...g, status: RegistrationStatus.SUCCESS, alloggiatiId: result.id }
            : { ...g, status: RegistrationStatus.ERROR, errorMessage: result.error };
        }
        return g;
      }));
    } catch (e) {
      setGuests(current => current.map(g => g.id === guestId ? { ...g, status: RegistrationStatus.ERROR, errorMessage: "Errore connessione portale" } : g));
    }
  };

  const handleSmartParse = async (text?: string, image?: {data: string, mimeType: string}, source: string = "Manuale"): Promise<{success: boolean, guestId?: string, errorStatus?: number, retryAfter?: number}> => {
    setIsProcessing(true);
    try {
      const sanitized = await sanitizeGuestData({ text, image });
      const newId = Math.random().toString(36).substr(2, 9);
      const newGuest: GuestData = {
        ...sanitized,
        id: newId,
        status: RegistrationStatus.PENDING,
        source: source === "Manuale" && text?.toLowerCase().includes("airbnb") ? "Airbnb Chat" : source,
      } as GuestData;
      
      setGuests(prev => [newGuest, ...prev]);
      return { success: true, guestId: newId };
    } catch (error) {
      return { success: false };
    } finally {
      setIsProcessing(false);
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
            const result = await handleSmartParse(email.content, undefined, "Gmail Automatica");
            if (result.success) {
              processedTimestamps.current.add(emailId);
              if (settings.autoSync && result.guestId) handleRegister(result.guestId);
              await delay(REQUEST_DELAY_MS);
            }
          }
        }
      }
    } catch (e) {
      console.error("Sync error", e);
    } finally {
      setIsCloudSyncing(false);
    }
  }, [settings, isCloudSyncing]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onSettingsClick={() => setShowSettings(!showSettings)} pendingCount={guests.length} isCloudSyncing={isCloudSyncing} />
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 flex justify-center gap-8">
          <button onClick={() => setActiveTab('dashboard')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'dashboard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>DASHBOARD OSPITI</button>
          <button onClick={() => setActiveTab('integration')} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'integration' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>GUIDA TECNICA</button>
        </div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Dashboard guests={guests} onRegister={handleRegister} onDelete={id => setGuests(g => g.filter(x => x.id !== id))} isProcessing={isProcessing} onManualSync={pollGmail} isSyncing={isCloudSyncing} searchDays={settings.searchDays} />
            </div>
            <div className="space-y-6">
              <SmartParser onParse={handleSmartParse} isProcessing={isProcessing} />
              {showSettings && <SettingsPanel settings={settings} onUpdate={s => setSettings(prev => ({...prev, ...s}))} onClose={() => setShowSettings(false)} />}
            </div>
          </div>
        ) : <IntegrationGuide />}
      </main>
    </div>
  );
};

export default App;
