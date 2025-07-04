
-- Create enum types for better data integrity
CREATE TYPE public.user_role AS ENUM ('farmer', 'landowner', 'service_provider', 'admin');
CREATE TYPE public.land_type AS ENUM ('coconut', 'areca', 'paddy', 'vegetable', 'fruit', 'mixed');
CREATE TYPE public.inquiry_status AS ENUM ('pending', 'contacted', 'closed');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'farmer',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create land listings table
CREATE TABLE public.land_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  land_type land_type NOT NULL,
  area_acres DECIMAL(10,2) NOT NULL,
  price_per_acre DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT DEFAULT 'Karnataka',
  is_available BOOLEAN DEFAULT true,
  features TEXT[], -- Array of features like 'water_source', 'electricity', etc.
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  price_per_unit DECIMAL(10,2),
  unit_type TEXT, -- 'per_acre', 'per_hour', 'fixed', etc.
  location TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table for contact forms and land inquiries
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  land_listing_id UUID REFERENCES public.land_listings(id) ON DELETE SET NULL,
  status inquiry_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pricing data table for dynamic calculator
CREATE TABLE public.pricing_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  land_type land_type NOT NULL,
  district TEXT NOT NULL,
  min_price_per_acre DECIMAL(12,2) NOT NULL,
  max_price_per_acre DECIMAL(12,2) NOT NULL,
  average_price_per_acre DECIMAL(12,2) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(land_type, district)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for land listings
CREATE POLICY "Anyone can view available land listings" ON public.land_listings FOR SELECT USING (is_available = true);
CREATE POLICY "Owners can manage their listings" ON public.land_listings FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for services
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Providers can manage their services" ON public.services FOR ALL USING (auth.uid() = provider_id);

-- RLS Policies for inquiries
CREATE POLICY "Anyone can create inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Land owners can view inquiries for their listings" ON public.inquiries 
  FOR SELECT USING (
    land_listing_id IN (
      SELECT id FROM public.land_listings WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for pricing data
CREATE POLICY "Anyone can view pricing data" ON public.pricing_data FOR SELECT USING (true);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'farmer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample pricing data
INSERT INTO public.pricing_data (land_type, district, min_price_per_acre, max_price_per_acre, average_price_per_acre) VALUES
('coconut', 'Hassan', 300000, 800000, 550000),
('coconut', 'Shimoga', 250000, 700000, 475000),
('coconut', 'Tumkur', 400000, 900000, 650000),
('areca', 'Hassan', 800000, 1500000, 1150000),
('areca', 'Shimoga', 600000, 1200000, 900000),
('areca', 'Chikmagalur', 700000, 1400000, 1050000),
('paddy', 'Hassan', 200000, 500000, 350000),
('paddy', 'Mandya', 250000, 600000, 425000),
('vegetable', 'Kolar', 300000, 700000, 500000),
('fruit', 'Hassan', 400000, 1000000, 700000);
