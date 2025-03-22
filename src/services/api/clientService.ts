import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Client {
  id: string;
  nom: string;
  SIREN?: string;
  SIRET?: string;
  code_postal?: string;
  code_NAF?: string;
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
    // In a production environment, this would fetch from the API
    // For now, return dummy data
    const clients = [
      {
        id: '1',
        nom: 'Société A',
        SIREN: '123456789',
        SIRET: '12345678901234',
        code_postal: '75001',
        chiffre_d_affaires: 1000000,
      },
      {
        id: '2',
        nom: 'Entreprise B',
        SIREN: '987654321',
        SIRET: '98765432109876',
        code_postal: '69002',
        chiffre_d_affaires: 2500000,
      },
      {
        id: '3',
        nom: 'Corporation C',
        SIREN: '456789123',
        SIRET: '45678912345678',
        code_postal: '33000',
        chiffre_d_affaires: 5000000,
      },
      {
        id: '4',
        nom: 'Entreprise D',
        SIREN: '789123456',
        SIRET: '78912345678912',
        code_postal: '59000',
        chiffre_d_affaires: 750000,
      },
      {
        id: '5',
        nom: 'Groupe E',
        SIREN: '321654987',
        SIRET: '32165498765432',
        code_postal: '13001',
        chiffre_d_affaires: 3000000,
      },
    ];

    if (search) {
      const filteredClients = clients.filter(client => 
        client.nom.toLowerCase().includes(search.toLowerCase()) ||
        (client.SIREN && client.SIREN.includes(search)) ||
        (client.SIRET && client.SIRET.includes(search)) ||
        (client.code_postal && client.code_postal.includes(search))
      );
      
      return {
        clients: filteredClients,
        total: filteredClients.length,
        page: 1,
        limit,
        totalPages: Math.ceil(filteredClients.length / limit)
      };
    }

    return {
      clients,
      total: clients.length,
      page,
      limit,
      totalPages: Math.ceil(clients.length / limit)
    };
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