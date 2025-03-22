import { api, API_URL } from './index';
export interface Contact {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  poste?: string;
  client_id?: string;
  client?: {
    id: string;
    nom: string;
  };
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const contactService = {
  getAll: async (page = 1, limit = 10, search = '', clientId = ''): Promise<ContactsResponse> => {
    const response = await api.get(`${API_URL}/contacts`, {
      params: {
        page,
        limit,
        search,
        client_id: clientId
      }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Contact> => {
    const response = await api.get(`${API_URL}/contacts/${id}`);
    return response.data;
  },

  create: async (contactData: Omit<Contact, 'id' | 'client' | 'createdAt' | 'updatedAt'>): Promise<Contact> => {
    const response = await api.post(`${API_URL}/contacts`, contactData);
    return response.data;
  },

  update: async (id: string, contactData: Partial<Omit<Contact, 'id' | 'client' | 'createdAt' | 'updatedAt'>>): Promise<Contact> => {
    const response = await api.put(`${API_URL}/contacts/${id}`, contactData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/contacts/${id}`);
  }
};

export default contactService; 