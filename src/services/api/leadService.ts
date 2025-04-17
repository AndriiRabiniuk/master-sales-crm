import { api, API_URL } from './index';
import { LeadSource, LeadStatus, IClient, IUser } from './types';

export interface Task {
  _id: string;
  interaction_id: {
    _id: string;
    lead_id: string;
    date_interaction: string;
    type_interaction: string;
    description: string;
    created_at: string;
    createdAt: string;
    updatedAt: string;
  };
  titre: string;
  description: string;
  statut: 'completed' | 'in progress' | 'pending';
  due_date: string;
  assigned_to: {
    _id: string;
    name: string;
    email: string;
  };
  created_at: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  user_id?: string | IUser;
  client_id: string | IClient;
  name: string;
  source: LeadSource;
  statut: LeadStatus;
  valeur_estimee: number;
  description?: string;
  created_at: string;
  createdAt?: string; // For backward compatibility
  updatedAt?: string; // For backward compatibility
  tasks?: Task[];
  interactions?: {
    _id: string;
    lead_id: {
      _id: string;
      name: string;
    };
    date_interaction: string;
    type_interaction: string;
    description: string;
    created_at: string;
    createdAt: string;
    updatedAt: string;
  }[];
  statusLogs?: {
    _id: string;
    lead_id: string;
    previous_status: string;
    new_status: string;
    changed_by: {
      _id: string;
      name: string;
      email: string;
    };
    changed_at: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
  }[];
  
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
  getAll: async (page = 1, limit = 10, search = '', client_id?: string, personal?: boolean): Promise<LeadsResponse> => {
    try {
      console.log('Lead getAll - token before request:', localStorage.getItem('token'));
      
      const response = await api.get<LeadsResponse>(`${API_URL}/leads`, {
        params: { page, limit, search, client_id, personal }
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
  },

  assignLead: async (leadId: string, userId: string): Promise<Lead> => {
    try {
      const response = await api.put<Lead>(`${API_URL}/leads/${leadId}/assign`, { userId });
      return response.data;
    } catch (error) {
      console.error(`Error assigning lead with id ${leadId}:`, error);
      throw error;
    }
  }
};

export default leadService; 