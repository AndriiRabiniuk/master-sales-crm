import { api, API_URL } from './index';

export interface Task {
  _id: string;
  titre: string;
  description?: string;
  statut: 'pending' | 'in progress' | 'completed';
  due_date?: string;
  interaction_id: {
    _id: string;
    lead_id: {
      _id: string;
      client_id: {
        _id: string;
        name: string;
      };
      name: string;
    };
    date_interaction: string;
    type_interaction: string;
  };
  assigned_to: {
    _id: string;
    email: string;
  };
  created_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Type for creating a new task
export interface CreateTaskRequest {
  titre: string;
  description?: string;
  statut: 'pending' | 'in progress' | 'completed';
  due_date?: string;
  interaction_id: string;
  assigned_to?: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const taskService = {
  getAll: async (page = 1, limit = 10, search = '', personal?: boolean): Promise<TasksResponse> => {
    try {
      const response = await api.get<TasksResponse>(`${API_URL}/tasks`, {
        params: { page, limit, search, personal }
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

  create: async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      const response = await api.post<Task>(`${API_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  update: async (id: string, taskData: Partial<CreateTaskRequest>): Promise<Task> => {
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