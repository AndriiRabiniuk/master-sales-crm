import { api, API_URL } from './index';
import { 
  IInteraction, 
  ICreateInteractionRequest,
  IPaginatedResponse
} from './types';

// Response interface for interaction endpoints
export type InteractionsResponse = IPaginatedResponse<IInteraction>;

const interactionService = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<InteractionsResponse> => {
    try {
      const response = await api.get<InteractionsResponse>(`${API_URL}/interactions`, {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching interactions:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<IInteraction> => {
    try {
      const response = await api.get<IInteraction>(`${API_URL}/interactions/${id}`);
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

  create: async (interactionData: ICreateInteractionRequest): Promise<IInteraction> => {
    try {
      const response = await api.post<IInteraction>(`${API_URL}/interactions`, interactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating interaction:', error);
      throw error;
    }
  },

  update: async (id: string, interactionData: Partial<ICreateInteractionRequest>): Promise<IInteraction> => {
    try {
      const response = await api.put<IInteraction>(`${API_URL}/interactions/${id}`, interactionData);
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