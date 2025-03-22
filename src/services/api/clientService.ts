import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Client {
  id: string;
  nom: string;
  SIREN: string;
  SIRET: string;
  code_postal: string;
  code_NAF: string;
  chiffre_d_affaires?: number;
  EBIT?: number;
  latitude?: number;
  longitude?: number;
  pdm?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientsResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const clientService = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<ClientsResponse> => {
    const response = await axios.get(`${API_URL}/clients`, {
      params: {
        page,
        limit,
        search
      }
    });
    return response.data;
  },

  getById: async (id: string): Promise<Client> => {
    const response = await axios.get(`${API_URL}/clients/${id}`);
    return response.data;
  },

  create: async (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
    const response = await axios.post(`${API_URL}/clients`, clientData);
    return response.data;
  },

  update: async (id: string, clientData: Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Client> => {
    const response = await axios.put(`${API_URL}/clients/${id}`, clientData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/clients/${id}`);
  }
};

export default clientService; 