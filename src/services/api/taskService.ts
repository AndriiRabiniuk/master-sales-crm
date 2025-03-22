import { api, API_URL } from './index';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  due_date?: string;
  statut: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  priorite: 'low' | 'medium' | 'high';
  interaction_id: string;
  user_id: string;
  interaction?: {
    _id: string;
    title: string;
    lead_id: string;
  };
  user?: {
    _id: string;
    name: string;
  };
  created_at: string;
  updated_at?: string;
}

export interface TasksResponse {
  tasks: Task[];
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

  getByInteractionId: async (interactionId: string, page = 1, limit = 50): Promise<TasksResponse> => {
    try {
      const response = await api.get<TasksResponse>(`${API_URL}/interactions/${interactionId}/tasks`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for interaction ${interactionId}:`, error);
      throw error;
    }
  },

  getByUserId: async (userId: string, page = 1, limit = 50): Promise<TasksResponse> => {
    try {
      const response = await api.get<TasksResponse>(`${API_URL}/users/${userId}/tasks`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for user ${userId}:`, error);
      throw error;
    }
  },

  create: async (taskData: Omit<Task, '_id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    try {
      const response = await api.post<Task>(`${API_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  update: async (id: string, taskData: Partial<Omit<Task, '_id' | 'created_at' | 'updated_at'>>): Promise<Task> => {
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