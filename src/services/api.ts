import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_URL = 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (username: string, email: string, password: string, role: string) => {
    const response = await api.post('/auth/register', { username, email, password, role });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Clients Services
export const clientService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/clients?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  search: async (term: string, page = 1, limit = 10) => {
    const response = await api.get(`/clients/search?term=${term}&page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  
  create: async (clientData: any) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  
  update: async (id: string, clientData: any) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  }
};

// Contacts Services
export const contactService = {
  getAll: async () => {
    const response = await api.get('/contacts');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },
  
  create: async (contactData: any) => {
    const response = await api.post('/contacts', contactData);
    return response.data;
  },
  
  update: async (id: string, contactData: any) => {
    const response = await api.put(`/contacts/${id}`, contactData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  }
};

// Leads Services
export const leadService = {
  getAll: async () => {
    const response = await api.get('/leads');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },
  
  create: async (leadData: any) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },
  
  update: async (id: string, leadData: any) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  }
};

// Interactions Services
export const interactionService = {
  getAll: async () => {
    const response = await api.get('/interactions');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/interactions/${id}`);
    return response.data;
  },
  
  create: async (interactionData: any) => {
    const response = await api.post('/interactions', interactionData);
    return response.data;
  },
  
  update: async (id: string, interactionData: any) => {
    const response = await api.put(`/interactions/${id}`, interactionData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/interactions/${id}`);
    return response.data;
  }
};

// Notes Services
export const noteService = {
  getAll: async () => {
    const response = await api.get('/notes');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },
  
  create: async (noteData: any) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },
  
  update: async (id: string, noteData: any) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  }
};

// Tasks Services
export const taskService = {
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  create: async (taskData: any) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  update: async (id: string, taskData: any) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default api; 