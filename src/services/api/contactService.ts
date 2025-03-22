import { api, API_URL } from './index';
import { 
  IContact,
  ICreateContactRequest,
  IPaginatedResponse
} from './types';

// Response interface for contact endpoints
export type ContactsResponse = IPaginatedResponse<IContact>;

const contactService = {
  getAll: async (page = 1, limit = 10, search = '', clientId = ''): Promise<ContactsResponse> => {
    try {
      const response = await api.get<ContactsResponse>(`${API_URL}/contacts`, {
        params: {
          page,
          limit,
          search,
          client_id: clientId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<IContact> => {
    try {
      const response = await api.get<IContact>(`${API_URL}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with id ${id}:`, error);
      throw error;
    }
  },

  getByClientId: async (clientId: string, page = 1, limit = 50): Promise<ContactsResponse> => {
    try {
      const response = await api.get<ContactsResponse>(`${API_URL}/clients/${clientId}/contacts`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching contacts for client ${clientId}:`, error);
      // If specific endpoint doesn't exist, fall back to filtered getAll
      return contactService.getAll(page, limit, '', clientId);
    }
  },

  create: async (contactData: ICreateContactRequest): Promise<IContact> => {
    try {
      const response = await api.post<IContact>(`${API_URL}/contacts`, contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  update: async (id: string, contactData: Partial<ICreateContactRequest>): Promise<IContact> => {
    try {
      const response = await api.put<IContact>(`${API_URL}/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      console.error(`Error updating contact with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/contacts/${id}`);
    } catch (error) {
      console.error(`Error deleting contact with id ${id}:`, error);
      throw error;
    }
  }
};

export default contactService; 