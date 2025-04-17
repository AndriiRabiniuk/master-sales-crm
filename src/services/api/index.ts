import clientService from './clientService';
import contactService from './contactService';
import leadService from './leadService';
import taskService from './taskService';
import mockAuthService, { User } from './mockAuthService';
import axios from 'axios';

// Base URL for all API calls
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Token handling utilities
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Axios instance with authorization headers
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to all requests except login and register
api.interceptors.request.use((config) => {
  // Skip auth header for auth endpoints
  if (config.url && (config.url.includes('login') || config.url.includes('register'))) {
    return config;
  }
  
  const token = getToken();
  console.log('API Request:', config.url, 'Token exists:', !!token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Added Authorization header:', `Bearer ${token.substring(0, 10)}...`);
  } else {
    console.warn('No token found in localStorage for request to:', config.url);
  }
  return config;
});

// Add token refresh interceptor for 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { token, refreshToken: newRefreshToken } = res.data;
        
        // Store the new tokens
        setToken(token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update the auth header and retry the request
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        removeToken();
        localStorage.removeItem('refreshToken');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Export the API interfaces for type safety
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Rename mock service to authService for consistency
const authService = mockAuthService;

// Export services and types
export {
  clientService,
  contactService,
  leadService,
  taskService,
  authService
};

export type { User }; 