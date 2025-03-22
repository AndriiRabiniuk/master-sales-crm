import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Task {
  id: string;
  titre: string;
  description?: string;
  dateEcheance?: string;
  statut: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  priorite: 'low' | 'medium' | 'high';
  client_id?: string;
  client?: {
    id: string;
    nom: string;
  };
  lead_id?: string;
  lead?: {
    id: string;
    nom: string;
  };
  contact_id?: string;
  contact?: {
    id: string;
    nom: string;
    prenom: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const taskService = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<Task[]> => {
    // In a production environment, this would fetch from the API
    // For now, return dummy data
    return [
      {
        id: '1',
        titre: 'Appeler le client',
        statut: 'not_started',
        priorite: 'high',
        dateEcheance: new Date(Date.now() + 86400000).toISOString(),
      },
      {
        id: '2',
        titre: 'Envoyer un devis',
        statut: 'completed',
        priorite: 'medium',
        dateEcheance: new Date().toISOString(),
      },
      {
        id: '3',
        titre: 'Suivre la relance',
        statut: 'in_progress',
        priorite: 'medium',
        dateEcheance: new Date(Date.now() + 172800000).toISOString(),
      },
      {
        id: '4',
        titre: 'Rendez-vous client',
        statut: 'not_started',
        priorite: 'high',
        dateEcheance: new Date(Date.now() + 259200000).toISOString(),
      },
      {
        id: '5',
        titre: 'Mise à jour du contrat',
        statut: 'delayed',
        priorite: 'low',
        dateEcheance: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
  },

  getById: async (id: string): Promise<Task> => {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  },

  create: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
  },

  update: async (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/tasks/${id}`);
  },
  
  completeTask: async (id: string): Promise<Task> => {
    const response = await axios.put(`${API_URL}/tasks/${id}/complete`, {});
    return response.data;
  }
};

export default taskService; 