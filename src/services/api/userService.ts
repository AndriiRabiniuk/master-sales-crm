import { api, API_URL } from './index';

// Enums
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  SALES = 'sales',
  SUPPORT = 'support'
}

// User interface based on the IUser interface
export interface User {
  _id: string;
  company_id?: any; // Optional for super_admin
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company_id?: string;
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

  update: async (id: string, userData: Partial<Omit<User, '_id' | 'created_at' | 'createdAt' | 'updatedAt'>>): Promise<User> => {
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
  },

  create: async (userData: CreateUserData): Promise<User> => {
    try {
      const response = await api.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/users/${id}`);
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
      throw error;
    }
  }
};

export default userService; 