
export enum RegistrationStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  VALIDATING = 'VALIDATING'
}

export enum GuestType {
  HEAD = '16', 
  FAMILY = '17',
  GROUP = '18'
}

export interface GuestData {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  citizenship: string;
  documentType: string;
  documentNumber: string;
  documentIssuePlace: string;
  arrivalDate: string;
  stayDays: number;
  guestType: GuestType | string;
  reservationCode?: string; // Codice Airbnb (es. HMXXXXXXX)
  rawWebhookData?: any;
  status: RegistrationStatus;
  errorMessage?: string;
  alloggiatiId?: string;
  source?: string;
}

export interface AppSettings {
  wsKey: string;
  userCode: string;
  password: string;
  propertyId: string;
  autoSync: boolean;
  autoGmailCheck: boolean;
  sheetCsvUrl: string;
  searchDays: number;
}
