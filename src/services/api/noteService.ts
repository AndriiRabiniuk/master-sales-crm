import { api, API_URL } from './index';

export interface Note {
  _id: string;
  client_id: {
    _id: string;
    company_id: {
      _id: string;
      name: string;
    };
    name: string;
  };
  contenu: string;
  created_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateNoteRequest {
  client_id: string;
  contenu: string;
}

export interface NotesResponse {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const noteService = {
  getAll: async (page = 1, limit = 10): Promise<NotesResponse> => {
    try {
      const response = await api.get<NotesResponse>(`${API_URL}/notes`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Note> => {
    try {
      const response = await api.get<Note>(`${API_URL}/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching note with id ${id}:`, error);
      throw error;
    }
  },

  getByClientId: async (clientId: string, page = 1, limit = 50): Promise<NotesResponse> => {
    try {
      const response = await api.get<NotesResponse>(`${API_URL}/clients/${clientId}/notes`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching notes for client ${clientId}:`, error);
      throw error;
    }
  },

  create: async (noteData: CreateNoteRequest): Promise<Note> => {
    try {
      const response = await api.post<Note>(`${API_URL}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  update: async (id: string, noteData: Partial<CreateNoteRequest>): Promise<Note> => {
    try {
      const response = await api.put<Note>(`${API_URL}/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      console.error(`Error updating note with id ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}/notes/${id}`);
    } catch (error) {
      console.error(`Error deleting note with id ${id}:`, error);
      throw error;
    }
  }
};

export default noteService; 