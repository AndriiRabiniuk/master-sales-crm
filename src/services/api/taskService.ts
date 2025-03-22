import { api, API_URL } from './index';

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
  tasks: [];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const taskService = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<TasksResponse> => {
    try {
      const response = await api.get<TasksResponse>(`${API_URL}/tasks`, {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Task> => {
    try {
      const response = await api.get<Task>(`${API_URL}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw error;
    }
  },

  create: async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    try {
      const response = await api.post<Task>(`${API_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  update: async (id: string, taskData: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task> => {
    try {
      const response = await api.put<Task>(`${API_URL}/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  },
  
  completeTask: async (id: string): Promise<Task> => {
    try {
      const response = await api.put<Task>(`${API_URL}/tasks/${id}/complete`, {});
      return response.data;
    } catch (error) {
      console.error(`Error completing task with id ${id}:`, error);
      throw error;
    }
  }
};

export default taskService; 