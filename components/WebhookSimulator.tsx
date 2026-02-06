
import React, { useState } from 'react';

interface WebhookSimulatorProps {
  onSimulate: (json: string) => void;
  isProcessing: boolean;
}

const WebhookSimulator: React.FC<WebhookSimulatorProps> = ({ onSimulate, isProcessing }) => {
  const [data, setData] = useState(JSON.stringify({
    "entry_id": "1234",
    "form_name": "Check-in Online",
    "name": "Mario",
    "surname": "Rossi",
    "birthday": "1985-05-20",
    "birth_place": "Roma",
    "document_number": "CA12345XY",
    "document_type": "CARTA DI IDENTITA",
    "arrival": "2025-06-15",
    "nights": 3,
    "nationality": "ITALIANA"
  }, null, 2));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Simulatore Webhook (Formidable)
        </h3>
      </div>
      <div className="p-5">
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Incolla qui l'output JSON del modulo <strong>Formidable Forms</strong> del tuo sito WordPress per simulare la ricezione di un nuovo ospite.
        </p>
        <textarea 
          value={data}
          onChange={e => setData(e.target.value)}
          rows={6}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-mono focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <button 
          onClick={() => onSimulate(data)}
          disabled={isProcessing}
          className={`mt-4 w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            isProcessing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-900'
          }`}
        >
          {isProcessing ? 'Elaborazione...' : 'Invia Dati Test'}
        </button>
      </div>
    </div>
  );
};

export default WebhookSimulator;
