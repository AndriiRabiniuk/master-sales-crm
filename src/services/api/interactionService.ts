import { api, API_URL } from './index';

export interface Interaction {
  _id: string;
  lead_id: string;
  contact_id?: string;
  user_id: string;
  type: 'email' | 'call' | 'meeting' | 'other';
  title: string;
  content: string;
  date: string;
  created_at: string;
  updated_at?: string;
  user?: {
    _id: string;
    name: string;
  };
  contact?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface InteractionsResponse {
  interactions: Interaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const interactionService = {
  getAll: async (page = 1, limit = 10): Promise<InteractionsResponse> => {
    try {
      const response = await api.get<InteractionsResponse>(`${API_URL}/interactions`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching interactions:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Interaction> => {
    try {
      const response = await api.get<Interaction>(`${API_URL}/interactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching interaction with id ${id}:`, error);
      throw error;
    }
  },

  getByLeadId: async (leadId: string, page = 1, limit = 50): Promise<InteractionsResponse> => {
    try {
      const response = await api.get<InteractionsResponse>(`${API_URL}/leads/${leadId}/interactions`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching interactions for lead ${leadId}:`, error);
      throw error;
    }
  },

  create: async (interactionData: Omit<Interaction, '_id' | 'created_at' | 'updated_at'>): Promise<Interaction> => {
    try {
      const response = await api.post<Interaction>(`${API_URL}/interactions`, interactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating interaction:', error);
      throw error;
    }
  },

  update: async (id: string, interactionData: Partial<Omit<Interaction, '_id' | 'created_at' | 'updated_at'>>): Promise<Interaction> => {
    try {
      const response = await api.put<Interaction>(`${API_URL}/interactions/${id}`, interactionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating interaction with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/interactions/${id}`);
    } catch (error) {
      console.error(`Error deleting interaction with id ${id}:`, error);
      throw error;
    }
  }
};

export default interactionService; 