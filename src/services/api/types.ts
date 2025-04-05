// Enums
export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

export enum LeadSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  EVENT = 'event',
  OUTBOUND = 'outbound',
  INBOUND = 'inbound'
}

export enum LeadStatus {
  START_TO_CALL = 'Start-to-Call',
  CALL_TO_CONNECT = 'Call-to-Connect',
  CONNECT_TO_CONTACT = 'Connect-to-Contact',
  CONTACT_TO_DEMO = 'Contact-to-Demo',
  DEMO_TO_CLOSE = 'Demo-to-Close',
  LOST = 'Lost'
}

export enum InteractionType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed'
}

// Interfaces
export interface IUser {
  _id: string;
  company_id?: string | ICompany; // Optional for super_admin
  name: string;
  email: string;
  password?: string; // Note: This should never be sent to frontend
  role: UserRole;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ICompany {
  _id: string;
  name: string;
  SIREN?: string;
  SIRET?: string;
  code_postal?: string;
  code_NAF?: string;
  chiffre_d_affaires?: number;
  EBIT?: number;
  latitude?: number;
  longitude?: number;
  pdm?: number;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IClient {
  _id: string;
  company_id: string | ICompany;
  name: string;
  description?: string;
  marketSegment?: string;
  SIREN?: string;
  SIRET?: string;
  code_postal?: string;
  code_NAF?: string;
  chiffre_d_affaires?: number;
  EBIT?: number;
  latitude?: number;
  longitude?: number;
  pdm?: number;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ILead {
  _id: string;
  user_id: string | IUser;
  client_id: string | IClient;
  name: string;
  source: LeadSource;
  statut: LeadStatus;
  valeur_estimee: number;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IContact {
  _id: string;
  client_id: string | IClient;
  name: string;
  prenom: string;
  email: string;
  telephone?: string;
  fonction?: string;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IInteraction {
  _id: string;
  lead_id: string | ILead;
  date_interaction: Date | string;
  type_interaction: InteractionType;
  description?: string;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IInteractionContact {
  _id: string;
  interaction_id: string | IInteraction;
  contact_id: string | IContact;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface INote {
  _id: string;
  client_id: string | IClient;
  contenu: string;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ITask {
  _id: string;
  interaction_id: string | IInteraction;
  titre: string;
  description?: string;
  statut: TaskStatus;
  due_date: Date | string;
  assigned_to: string | IUser;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Response interfaces (without sensitive fields)
export interface IUserResponse {
  _id: string;
  company_id?: string | ICompany;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// API Request interfaces
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  company_id?: string;
}

export interface ICreateCompanyRequest {
  name: string;
  SIREN?: string;
  SIRET?: string;
  code_postal?: string;
  code_NAF?: string;
  chiffre_d_affaires?: number;
  EBIT?: number;
  latitude?: number;
  longitude?: number;
  pdm?: number;
}

export interface ICreateClientRequest {
  company_id: string;
  name: string;
  description?: string;
  marketSegment?: string;
  SIREN?: string;
  SIRET?: string;
  code_postal?: string;
  code_NAF?: string;
  chiffre_d_affaires?: number;
  EBIT?: number;
  latitude?: number;
  longitude?: number;
  pdm?: number;
}

export interface ICreateLeadRequest {
  client_id: string;
  name: string;
  source?: LeadSource;
  statut?: LeadStatus;
  valeur_estimee?: number;
}

export interface ICreateContactRequest {
  client_id: string;
  name: string;
  prenom: string;
  email: string;
  telephone?: string;
  fonction?: string;
}

export interface ICreateInteractionRequest {
  lead_id: string;
  date_interaction?: Date | string;
  type_interaction?: InteractionType;
  description?: string;
  contact_ids?: string[]; // Array of contact IDs to associate with this interaction
}

export interface ICreateNoteRequest {
  client_id: string;
  contenu: string;
}

export interface ICreateTaskRequest {
  interaction_id: string;
  titre: string;
  description?: string;
  statut?: TaskStatus;
  due_date: Date | string;
  assigned_to: string;
}

// Pagination interface
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
} 