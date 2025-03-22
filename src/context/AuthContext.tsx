import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { authService } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedToken = Cookies.get('token');
    console.log('Initial load - stored token:', storedToken ? 'Token exists' : 'No token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Set up axios interceptor for authentication
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  const fetchUserProfile = async (currentToken: string) => {
    try {
      console.log('Fetching user profile with token:', currentToken);
      
      // Use auth service instead of direct API call
      const userData = await authService.getUserProfile(currentToken);
      console.log('User profile fetched successfully:', userData);
      
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Cookies.remove('token');
      setToken(null);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting login with:', email);
      
      // Use auth service instead of direct API call
      const response = await authService.login(email, password);
      const { token: newToken, user: userData } = response;
      
      console.log('Login successful, received token and user data:', userData);
      
      setToken(newToken);
      setUser(userData);
      Cookies.set('token', newToken, { expires: 7 });
      
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setLoading(true);
      
      // Use auth service instead of direct API call
      await authService.register({
        firstName,
        lastName,
        email,
        password
      });
      
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setToken(null);
    router.push('/login');
    toast.info('You have been logged out');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      
      // Use auth service instead of direct API call
      const updatedUser = await authService.updateProfile(
        user.id,
        userData
      );
      
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 