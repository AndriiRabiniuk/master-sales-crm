import { api, API_URL } from './index';
import { 
  UserRole, 
  IUser, 
  IUserResponse, 
  ICreateUserRequest,
  IPaginatedResponse
} from './types';

// Response interface for user endpoints
export type UsersResponse = IPaginatedResponse<IUserResponse>;

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

  getById: async (id: string): Promise<IUserResponse> => {
    try {
      const response = await api.get<IUserResponse>(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<IUserResponse> => {
    try {
      const response = await api.get<IUserResponse>(`${API_URL}/users/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  update: async (id: string, userData: Partial<Omit<IUserResponse, '_id' | 'created_at' | 'createdAt' | 'updatedAt'>>): Promise<IUserResponse> => {
    try {
      const response = await api.put<IUserResponse>(`${API_URL}/users/${id}`, userData);
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

  create: async (userData: ICreateUserRequest): Promise<IUserResponse> => {
    try {
      const response = await api.post<IUserResponse>(`${API_URL}/users`, userData);
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
export { UserRole }; 