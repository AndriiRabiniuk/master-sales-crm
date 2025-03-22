// This file provides mock authentication services for development
// Will be replaced with actual API calls in production

import { api, API_URL, setToken, removeToken, LoginRequest, RegisterRequest, AuthResponse } from './index';
import axios from 'axios';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// A fixed mock user to facilitate development
const MOCK_USER: User = {
  _id: '1',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Mock user for testing regular user permissions
const MOCK_REGULAR_USER: User = {
  _id: '2',
  email: 'user@example.com',
  firstName: 'Regular',
  lastName: 'User',
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Auth service for handling authentication
const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, { email, password });
      const { token, refreshToken, user } = response.data;
      
      // Save tokens to localStorage
      setToken(token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    try {
      const response = await axios.post<User>(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  getUserProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>(`${API_URL}/auth/profile`);
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },
  
  // Alias for getUserProfile for backward compatibility
  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>(`${API_URL}/auth/profile`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<User>(`${API_URL}/auth/profile`, userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      await api.put(`${API_URL}/auth/change-password`, { oldPassword, newPassword });
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, { refreshToken });
      const { token, refreshToken: newRefreshToken } = response.data;
      
      // Update tokens
      setToken(token);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always remove tokens on logout
      removeToken();
      localStorage.removeItem('refreshToken');
    }
  }
};

export default authService; 