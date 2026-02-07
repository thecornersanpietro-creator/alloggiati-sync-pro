
import { GoogleGenAI, Type } from "@google/genai";
import { GuestData, RegistrationStatus, GuestType } from "../types.ts";

export interface ParseInput {
  text?: string;
  image?: {
    data: string; // base64
    mimeType: string;
  };
}

export const sanitizeGuestData = async (input: ParseInput): Promise<Partial<GuestData>> => {
  // Inizializzazione locale obbligatoria per catturare la chiave API aggiornata dal selettore
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];
  
  let prompt = `Sei un esperto del portale Alloggiati Web della Polizia di Stato italiana. 
    Estrai i dati dell'ospite principale da questo input.

    REGOLE CRITICHE PER LA CITTADINANZA:
    - La cittadinanza deve essere nel formato TESTO ITALIANO MAIUSCOLO (es: "ITALIA", "STATI UNITI", "FRANCIA", "GERMANIA", "REGNO UNITO", "SPAGNA").
    - Se l'ospite è americano, scrivi "STATI UNITI".
    - Se l'ospite è inglese, scrivi "REGNO UNITO".

    REGOLE PER I DOCUMENTI:
    - Identifica il tipo: "CARTA DI IDENTITA", "PASSAPORTO" o "PATENTE".
    - Estrai il numero esatto senza spazi.

    FORMATO RISPOSTA: JSON puro con campi: firstName, lastName, birthDate (YYYY-MM-DD), birthPlace, citizenship, documentType, documentNumber, documentIssuePlace, arrivalDate (YYYY-MM-DD), stayDays (numero), reservationCode.`;

  if (input.text) parts.push({ text: input.text });
  if (input.image) {
    parts.push({
      inlineData: {
        data: input.image.data,
        mimeType: input.image.mimeType
      }
    });
  }
  parts.push({ text: prompt });

  try {
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
            reservationCode: { type: Type.STRING }
          },
          required: ["firstName", "lastName"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      ...data,
      status: RegistrationStatus.PENDING,
      guestType: GuestType.HEAD
    };
  } catch (e: any) {
    const errorMsg = e.message || "";
    // Handle quota errors and invalid keys according to guidelines
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    if (errorMsg.includes("Requested entity was not found")) {
      throw new Error("API_KEY_INVALID");
    }
    throw new Error("Impossibile decifrare i dati. Controlla la qualità della foto o del testo.");
  }
};
