import { api, API_URL } from './index';
import { 
  IClient, 
  ICreateClientRequest,
  IPaginatedResponse
} from './types';

// Response interface for client endpoints
export type ClientsResponse = IPaginatedResponse<IClient>;

const clientService = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<ClientsResponse> => {
    try {
      console.log('Client getAll - token before request:', localStorage.getItem('token'));
      
      const response = await api.get<ClientsResponse>(`${API_URL}/clients`, {
        params: { page, limit, search }
      });
      
      console.log('Client getAll - response received:', response.status);
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<IClient> => {
    try {
      const response = await api.get<IClient>(`${API_URL}/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client with id ${id}:`, error);
      throw error;
    }
  },

  create: async (clientData: ICreateClientRequest): Promise<IClient> => {
    try {
      const response = await api.post<IClient>(`${API_URL}/clients`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  update: async (id: string, clientData: Partial<ICreateClientRequest>): Promise<IClient> => {
    try {
      const response = await api.put<IClient>(`${API_URL}/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Error updating client with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/clients/${id}`);
    } catch (error) {
      console.error(`Error deleting client with id ${id}:`, error);
      throw error;
    }
  }
};

export default clientService; 