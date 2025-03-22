import { api, API_URL } from './index';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const userService = {
  getAll: async (page = 1, limit = 50): Promise<UsersResponse> => {
    try {
      const response = await api.get<UsersResponse>(`${API_URL}/users`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const response = await api.get<User>(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>(`${API_URL}/users/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  update: async (id: string, userData: Partial<Omit<User, '_id' | 'created_at' | 'updated_at'>>): Promise<User> => {
    try {
      const response = await api.put<User>(`${API_URL}/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with id ${id}:`, error);
      throw error;
    }
  },

  updatePassword: async (id: string, currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.put(`${API_URL}/users/${id}/password`, {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error(`Error updating password for user with id ${id}:`, error);
      throw error;
    }
  }
};

export default userService; 