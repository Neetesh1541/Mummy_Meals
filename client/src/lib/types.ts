export interface User {
  id: string;
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

export interface Mom extends User {
  kitchen_name: string;
  specialties: string[];
  rating: number;
  total_orders: number;
  is_available: boolean;
  delivery_radius: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface DeliveryPartner extends User {
  vehicle_type: 'bike' | 'scooter' | 'bicycle';
  license_number: string;
  is_online: boolean;
  current_location?: {
    lat: number;
    lng: number;
  };
  total_deliveries: number;
  rating: number;
}

export interface MenuItem {
  id: string;
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
}

export interface Order {
  id: string;
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

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'general';
  is_read: boolean;
  data?: any;
  created_at: string;
}