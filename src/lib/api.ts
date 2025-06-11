import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: 'foodie' | 'mom' | 'delivery';
  address?: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'foodie' | 'mom' | 'delivery';
  address?: string;
  additionalData?: any;
}

// Auth API calls
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  getProfile: async (): Promise<{ success: boolean; user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<{ success: boolean; user: User }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }
};

export default api;