import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Lead {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  statut: 'new' | 'contacted' | 'negotiation' | 'won' | 'lost';
  source?: string;
  description?: string;
  valeur_estimee?: number;
  contact_id?: string;
  contact?: {
    id: string;
    nom: string;
    prenom: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const leadService = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<Lead[]> => {
    // In a production environment, this would fetch from the API
    // For now, return dummy data
    return [
      {
        id: '1',
        nom: 'Lead 1',
        email: 'lead1@example.com',
        statut: 'new',
        valeur_estimee: 10000,
      },
      {
        id: '2',
        nom: 'Lead 2',
        email: 'lead2@example.com',
        statut: 'contacted',
        valeur_estimee: 15000,
      },
      {
        id: '3',
        nom: 'Lead 3',
        email: 'lead3@example.com',
        statut: 'negotiation',
        valeur_estimee: 20000,
      },
      {
        id: '4',
        nom: 'Lead 4',
        email: 'lead4@example.com',
        statut: 'won',
        valeur_estimee: 25000,
      },
      {
        id: '5',
        nom: 'Lead 5',
        email: 'lead5@example.com',
        statut: 'lost',
        valeur_estimee: 30000,
      }
    ];
  },

  getById: async (id: string): Promise<Lead> => {
    const response = await axios.get(`${API_URL}/leads/${id}`);
    return response.data;
  },

  create: async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    const response = await axios.post(`${API_URL}/leads`, leadData);
    return response.data;
  },

  update: async (id: string, leadData: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Lead> => {
    const response = await axios.put(`${API_URL}/leads/${id}`, leadData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/leads/${id}`);
  }
};

export default leadService; 