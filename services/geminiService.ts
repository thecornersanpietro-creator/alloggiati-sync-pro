
import { GoogleGenAI, Type } from "@google/genai";
import { GuestData, RegistrationStatus, GuestType } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ParseInput {
  text?: string;
  image?: {
    data: string; // base64
    mimeType: string;
  };
}

export const sanitizeGuestData = async (input: ParseInput): Promise<Partial<GuestData>> => {
  const parts: any[] = [];
  
  let prompt = `Analizza questo input (testo o immagine di documento/prenotazione) ed estrai i dati per il portale Alloggiati Web della Polizia di Stato.
    
    REGOLE DI ESTRAZIONE:
    1. "firstName" e "lastName": Dividi bene nome e cognome.
    2. "birthDate": Cerca date nel formato gg/mm/aaaa e convertile in YYYY-MM-DD.
    3. "birthPlace": Luogo di nascita. Se estero, scrivi "Città (Nazione)".
    4. "citizenship": Nazione (es. "Italia", "Francia").
    5. "documentType": "CARTA IDENTITA", "PASSAPORTO" o "PATENTE".
    6. "documentNumber": Codice alfanumerico del documento.
    7. "documentIssuePlace": Luogo di rilascio.
    8. "arrivalDate": Data di check-in (YYYY-MM-DD).
    9. "stayDays": Numero di notti.
    10. "guestType": "16" (Capofamiglia), "17" (Familiare), "18" (Gruppo).
    11. "reservationCode": Cerca codici prenotazione Airbnb tipo "HM" seguito da lettere/numeri.
    
    Restituisci solo JSON. Se un dato non è presente, usa una stringa vuota.`;

  if (input.text) {
    parts.push({ text: input.text });
  }
  
  if (input.image) {
    parts.push({
      inlineData: {
        data: input.image.data,
        mimeType: input.image.mimeType
      }
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          firstName: { type: Type.STRING },
          lastName: { type: Type.STRING },
          birthDate: { type: Type.STRING },
          birthPlace: { type: Type.STRING },
          citizenship: { type: Type.STRING },
          documentType: { type: Type.STRING },
          documentNumber: { type: Type.STRING },
          documentIssuePlace: { type: Type.STRING },
          arrivalDate: { type: Type.STRING },
          stayDays: { type: Type.NUMBER },
          guestType: { type: Type.STRING },
          reservationCode: { type: Type.STRING }
        },
        required: ["firstName", "lastName"]
      }
    }
  });

  try {
    const text = response.text;
    const data = JSON.parse(text || "{}");
    return {
      ...data,
      status: RegistrationStatus.PENDING,
      guestType: data.guestType || GuestType.HEAD
    };
  } catch (e) {
    console.error("Gemini Error:", e);
    throw new Error("Errore durante l'analisi. Verifica il testo o la qualità della foto.");
  }
};
