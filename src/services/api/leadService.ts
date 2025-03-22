import { api, API_URL } from './index';

export interface Lead {
  _id: string;
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
  getAll: async (page = 1, limit = 10, search = ''): Promise<LeadsResponse> => {
    try {
      const response = await api.get<LeadsResponse>(`${API_URL}/leads`, {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Lead> => {
    try {
      const response = await api.get<Lead>(`${API_URL}/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lead with id ${id}:`, error);
      throw error;
    }
  },

  create: async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    try {
      const response = await api.post<Lead>(`${API_URL}/leads`, leadData);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  update: async (id: string, leadData: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Lead> => {
    try {
      const response = await api.put<Lead>(`${API_URL}/leads/${id}`, leadData);
      return response.data;
    } catch (error) {
      console.error(`Error updating lead with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/leads/${id}`);
    } catch (error) {
      console.error(`Error deleting lead with id ${id}:`, error);
      throw error;
    }
  }
};

export default leadService; 