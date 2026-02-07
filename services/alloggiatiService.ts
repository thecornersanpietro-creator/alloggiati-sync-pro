
import { GuestData } from "../types.ts";

export const sendToAlloggiati = async (guest: GuestData, wsKey: string): Promise<{ success: boolean; id?: string; error?: string }> => {
  // Simulazione dell'invio al portale Alloggiati Web
  console.log("INVIO DATI PORTALE:", {
    nominativo: `${guest.firstName} ${guest.lastName}`,
    cittadinanza: guest.citizenship,
    documento: guest.documentNumber,
    notti: guest.stayDays
  });
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simuliamo successo nel 100% dei casi se i dati minimi ci sono, 
      // per permettere all'utente di testare il flusso.
      if (guest.firstName && guest.lastName && guest.documentNumber) {
        resolve({
          success: true,
          id: `PROT-${Math.floor(Math.random() * 1000000)}`
        });
      } else {
        resolve({
          success: false,
          error: "Dati mancanti: Nome, Cognome o Numero Documento sono obbligatori."
        });
      }
    }, 1500);
  });
};
