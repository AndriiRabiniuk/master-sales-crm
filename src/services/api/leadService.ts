import { api, API_URL } from './index';

export interface Lead {
  _id: string;
  user_id: string;
  client_id: any;
  name: string;
  source: 'website' | 'referral' | 'event';
  statut: 'new' | 'contacted' | 'won' | 'lost';
  valeur_estimee: number;
  created_at: string;
  createdAt?: string; // For backward compatibility
  updatedAt?: string; // For backward compatibility
  
  // Additional fields we might get from the API or need for the UI
  client?: {
    id: string;
    nom: string;
  };
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
      console.log('Lead getAll - token before request:', localStorage.getItem('token'));
      
      const response = await api.get<LeadsResponse>(`${API_URL}/leads`, {
        params: { page, limit, search }
      });
      
      console.log('Lead getAll - response received:', response.status);
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

  create: async (leadData: Omit<Lead, '_id' | 'createdAt' | 'updatedAt' | 'created_at'>): Promise<Lead> => {
    try {
      const response = await api.post<Lead>(`${API_URL}/leads`, leadData);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  update: async (id: string, leadData: Partial<Omit<Lead, '_id' | 'createdAt' | 'updatedAt' | 'created_at'>>): Promise<Lead> => {
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