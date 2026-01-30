
import { CaseFile } from './services/gemini';

export type FirmId = 'hernandez' | 'gregg';
export type UserRole = 'client' | 'attorney' | 'admin';
export type Language = 'en' | 'es';

export interface OfficeAddress {
  id: string;
  name: string;
  details: string; // Multi-line address and contact info
}

export interface FirmBranding {
  id: FirmId | 'custom';
  firmName: string;
  attorney: string;
  phone: string;
  website: string;
  websiteDisplay: string;
  primaryColor: string;
  secondaryColor: string;
  logoColor: string;
  tagline: string;
  logoData?: string; // Base64 custom logo
  themeId?: string;
  offices?: OfficeAddress[];
}

export type EmailDeliveryMode = 'managed' | 'professional';

export interface EmailConfig {
  mode: EmailDeliveryMode;
  routingEmail: string; // Where leads go
  outboundName: string; // E.g. "Hernandez Law Group Triage"
  managedAlias?: string; // E.g. "triage@injury.bot"
  smtpConfig?: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
  };
  apiKey?: string; // For SendGrid/Mailgun style integrations
}

export interface AttorneyProfile {
  id: string;
  name: string;
  title: string;
  initials: string;
  photoData?: string;
}

export interface SettlementBenchmark {
  id: string;
  injuryId: string;
  text: string;
  dateAdded: string;
  isDemo?: boolean;
}

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  method: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export interface EvidenceSubmission {
  id: string;
  name: string;
  contact: string;
  testimony: string;
  analysis: string;
  timestamp: string;
  files: CaseFile[];
  protocolStrength?: number;
}

export interface ChatTranscript {
  id: string;
  subject: string;
  timestamp: string;
  messages: { role: 'bot' | 'user'; text: string }[];
}

export interface ArchivedItem {
  id: string;
  type: 'inbox' | 'evidence' | 'chats' | 'calc_leads';
  data: any;
  archivedAt: string;
}

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  caseType: string;
  incidentDate: string;
  description: string;
}

export interface BodyPart {
  id: string;
  label: { en: string; es: string };
  description: { en: string; es: string };
  boost: number;
}

export interface ConductType {
  id: string;
  label: { en: string; es: string };
  description?: { en: string; es: string };
  multiplier: number;
}

export interface CaseEstimate {
  range: [number, number];
  economic: number;
  nonEconomic: number;
  multiplier: string;
}

// Admin-side Math Config
export interface StandardCalculatorConfig {
  bodyParts: BodyPart[];
  conductTypes: ConductType[];
}

export interface SeriousTier {
  label: string;
  edFloor: number;
  minWeight: number;
  desc: string;
}

export interface SeriousInjuryType {
  id: string;
  label: string;
  summary: string;
  tiers: [SeriousTier, SeriousTier, SeriousTier];
}

export interface SeriousCalculatorConfig {
  injuries: SeriousInjuryType[];
}

export interface WrongfulDeathConfig {
  pecuniaryFloor: number;
  consortiumMultiplier: number;
  anguishWeight: number;
  serviceValueYearly: number;
}

export interface CalculatorLead {
  id: string;
  name: string;
  phone: string;
  timestamp: string;
  calculatorSource: 'minor' | 'serious' | 'estate' | 'beneficiary';
  inputs: {
    injuryType: string;
    medicalBills: number;
    lostWages: number;
    futureMedical: number;
    outOfPocket: number;
  };
  valuation: {
    net: number;
  };
  aiAudit: string;
}
