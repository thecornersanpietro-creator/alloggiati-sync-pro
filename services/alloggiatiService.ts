
import { GuestData, RegistrationStatus } from "../types.ts";

export const sendToAlloggiati = async (guest: GuestData, wsKey: string): Promise<{ success: boolean; id?: string; error?: string }> => {
  // Simulazione dell'invio reale al portale Alloggiati Web
  console.log(`Inviando dati a Alloggiati Web per ${guest.firstName} ${guest.lastName} utilizzando WSKEY: ${wsKey.substring(0, 5)}...`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulazione successo/errore per demo
      const isSuccess = Math.random() > 0.1;
      if (isSuccess) {
        resolve({
          success: true,
          id: `ALL-${Math.floor(Math.random() * 1000000)}`
        });
      } else {
        resolve({
          success: false,
          error: "Errore di validazione: Il numero del documento non è nel formato corretto per la cittadinanza selezionata."
        });
      }
    }, 2000);
  });
};
