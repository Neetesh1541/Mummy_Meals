/*
  # Initial Database Schema for MummyMeals

  1. New Tables
    - `users` - Main user table for all user types (foodie, mom, delivery)
    - `moms` - Extended profile for mom chefs
    - `delivery_partners` - Extended profile for delivery partners
    - `menu_items` - Food items offered by moms
    - `orders` - Order management
    - `notifications` - Real-time notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Real-time Features
    - Enable real-time subscriptions for orders
    - Notification system for instant updates
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (main table for all user types)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('foodie', 'mom', 'delivery')),
  address text,
  avatar_url text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Moms table (extended profile for home chefs)
CREATE TABLE IF NOT EXISTS moms (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  kitchen_name text NOT NULL DEFAULT 'Home Kitchen',
  specialties text[] DEFAULT '{}',
  rating numeric(3,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  is_available boolean DEFAULT true,
  delivery_radius integer DEFAULT 5,
  location jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Delivery partners table
CREATE TABLE IF NOT EXISTS delivery_partners (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type text NOT NULL DEFAULT 'bike' CHECK (vehicle_type IN ('bike', 'scooter', 'bicycle')),
  license_number text,
  is_online boolean DEFAULT false,
  current_location jsonb,
  total_deliveries integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mom_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  category text DEFAULT 'main',
  is_veg boolean DEFAULT true,
  is_jain boolean DEFAULT false,
  is_healthy boolean DEFAULT false,
  tags text[] DEFAULT '{}',
  preparation_time integer DEFAULT 30,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  foodie_id uuid REFERENCES users(id) ON DELETE CASCADE,
  mom_id uuid REFERENCES users(id) ON DELETE CASCADE,
  delivery_partner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  items jsonb NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')),
  delivery_address text NOT NULL,
  delivery_instructions text,
  estimated_delivery_time timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'general' CHECK (type IN ('order', 'delivery', 'general')),
  is_read boolean DEFAULT false,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE moms ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read public user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for moms table
CREATE POLICY "Moms can manage own profile"
  ON moms
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read mom profiles"
  ON moms
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for delivery_partners table
CREATE POLICY "Delivery partners can manage own profile"
  ON delivery_partners
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read delivery partner profiles"
  ON delivery_partners
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for menu_items table
CREATE POLICY "Moms can manage own menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = mom_id);

CREATE POLICY "Anyone can read available menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (is_available = true);

-- RLS Policies for orders table
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = foodie_id OR auth.uid() = mom_id OR auth.uid() = delivery_partner_id);

CREATE POLICY "Foodies can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = foodie_id);

CREATE POLICY "Moms and delivery partners can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = mom_id OR auth.uid() = delivery_partner_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_moms_updated_at BEFORE UPDATE ON moms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delivery_partners_updated_at BEFORE UPDATE ON delivery_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time for orders table (for instant notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;