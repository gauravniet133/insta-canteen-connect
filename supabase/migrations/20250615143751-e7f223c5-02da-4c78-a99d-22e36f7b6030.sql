
-- Create enum types
CREATE TYPE public.user_role AS ENUM ('student', 'faculty', 'canteen_owner', 'admin');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');
CREATE TYPE public.canteen_status AS ENUM ('open', 'closed', 'busy');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role public.user_role DEFAULT 'student',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create canteens table
CREATE TABLE public.canteens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  location TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status public.canteen_status DEFAULT 'open',
  opening_time TIME,
  closing_time TIME,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  delivery_time_min INTEGER DEFAULT 15,
  delivery_time_max INTEGER DEFAULT 25,
  owner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create canteen_cuisines table for many-to-many relationship
CREATE TABLE public.canteen_cuisines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  canteen_id UUID REFERENCES public.canteens(id) ON DELETE CASCADE,
  cuisine_name TEXT NOT NULL,
  UNIQUE(canteen_id, cuisine_name)
);

-- Create food_items table
CREATE TABLE public.food_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  canteen_id UUID REFERENCES public.canteens(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  spice_level INTEGER DEFAULT 0, -- 0-5 scale
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  preparation_time INTEGER DEFAULT 10, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  canteen_id UUID REFERENCES public.canteens(id) ON DELETE CASCADE,
  status public.order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0,
  special_instructions TEXT,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  special_notes TEXT
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  canteen_id UUID REFERENCES public.canteens(id) ON DELETE CASCADE,
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canteens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canteen_cuisines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for canteens (public read access)
CREATE POLICY "Anyone can view canteens" ON public.canteens FOR SELECT USING (true);
CREATE POLICY "Canteen owners can update their canteens" ON public.canteens FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Canteen owners can insert canteens" ON public.canteens FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Create RLS policies for canteen_cuisines
CREATE POLICY "Anyone can view canteen cuisines" ON public.canteen_cuisines FOR SELECT USING (true);

-- Create RLS policies for food_items (public read access)
CREATE POLICY "Anyone can view food items" ON public.food_items FOR SELECT USING (true);

-- Create RLS policies for orders (users can only see their own orders)
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for canteens
INSERT INTO public.canteens (id, name, description, image_url, location, phone, status, opening_time, closing_time, rating, total_reviews, delivery_time_min, delivery_time_max) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Central Cafeteria', 'The main cafeteria serving a variety of cuisines with the best quality ingredients.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop', 'Main Campus', '+91-9876543210', 'open', '07:00:00', '22:00:00', 4.5, 245, 15, 25),
  ('550e8400-e29b-41d4-a716-446655440002', 'Hostel Mess', 'Authentic Indian cuisine served fresh daily with home-style cooking.', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop', 'Hostel Block A', '+91-9876543211', 'open', '06:00:00', '23:00:00', 4.2, 189, 10, 20),
  ('550e8400-e29b-41d4-a716-446655440003', 'Quick Bites', 'Perfect for quick snacks and beverages between classes.', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop', 'Library Block', '+91-9876543212', 'closed', '08:00:00', '20:00:00', 4.0, 156, 5, 15);

-- Insert sample cuisines
INSERT INTO public.canteen_cuisines (canteen_id, cuisine_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Indian'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Chinese'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Continental'),
  ('550e8400-e29b-41d4-a716-446655440002', 'South Indian'),
  ('550e8400-e29b-41d4-a716-446655440002', 'North Indian'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Snacks'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Fast Food'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Beverages');

-- Insert sample food items
INSERT INTO public.food_items (canteen_id, name, description, price, image_url, category, is_vegetarian, spice_level, rating, total_reviews) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Butter Chicken', 'Creamy tomato-based chicken curry with aromatic spices', 120.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop', 'Main Course', false, 2, 4.6, 89),
  ('550e8400-e29b-41d4-a716-446655440002', 'Masala Dosa', 'Crispy rice crepe filled with spiced potato mixture', 60.00, 'https://images.unsplash.com/photo-1694849681251-7b63b9f24f85?w=300&h=200&fit=crop', 'Main Course', true, 1, 4.4, 124),
  ('550e8400-e29b-41d4-a716-446655440003', 'Cheese Sandwich', 'Grilled sandwich with melted cheese and vegetables', 40.00, 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop', 'Snacks', true, 0, 4.2, 67),
  ('550e8400-e29b-41d4-a716-446655440003', 'Cold Coffee', 'Refreshing iced coffee with whipped cream', 50.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop', 'Beverages', true, 0, 4.3, 45);
