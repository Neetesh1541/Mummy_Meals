import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://mummymeals-api.onrender.com/api';

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

export interface MenuItem {
  _id: string;
  mom_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_veg: boolean;
  is_jain: boolean;
  is_healthy: boolean;
  tags: string[];
  preparation_time: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  _id: string;
  foodie_id: string;
  mom_id: string;
  delivery_partner_id?: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
  delivery_address: string;
  delivery_instructions?: string;
  estimated_delivery_time?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  menu_item_id: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  order_id: string;
  customer_details: {
    name: string;
    email: string;
    phone: string;
  };
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

// Menu API calls
export const menuAPI = {
  getMenuItems: async (filters?: any): Promise<{ success: boolean; items: MenuItem[] }> => {
    const response = await api.get('/menu', { params: filters });
    return response.data;
  },

  addMenuItem: async (data: Partial<MenuItem>): Promise<{ success: boolean; item: MenuItem }> => {
    const response = await api.post('/menu', data);
    return response.data;
  },

  updateMenuItem: async (id: string, data: Partial<MenuItem>): Promise<{ success: boolean; item: MenuItem }> => {
    const response = await api.put(`/menu/${id}`, data);
    return response.data;
  },

  deleteMenuItem: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  }
};

// Order API calls
export const orderAPI = {
  createOrder: async (data: Partial<Order>): Promise<{ success: boolean; order: Order }> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getMyOrders: async (): Promise<{ success: boolean; orders: Order[] }> => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<{ success: boolean; order: Order }> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  }
};

// Payment API calls
export const paymentAPI = {
  createPaymentIntent: async (data: PaymentData): Promise<{ success: boolean; client_secret: string; payment_intent_id: string }> => {
    const response = await api.post('/payments/create-intent', data);
    return response.data;
  },

  confirmPayment: async (payment_intent_id: string): Promise<{ success: boolean; payment: any }> => {
    const response = await api.post('/payments/confirm', { payment_intent_id });
    return response.data;
  }
};

export default api;