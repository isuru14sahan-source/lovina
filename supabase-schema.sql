-- ============================================================
-- LOVINA LUXURY JEWELLERY - SUPABASE DATABASE & STORAGE SCHEMA
-- Run this script in your Supabase SQL Editor (SQL Editor -> New query -> Paste & Run)
-- ============================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    sku TEXT,
    category TEXT NOT NULL,
    category_name TEXT,
    price_lkr NUMERIC NOT NULL,
    discount_price_lkr NUMERIC,
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    description TEXT,
    details JSONB DEFAULT '[]'::jsonb,
    attributes JSONB DEFAULT '{}'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    variants JSONB DEFAULT '[]'::jsonb,
    stock_quantity INTEGER DEFAULT 10,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    date TEXT NOT NULL,
    items JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method TEXT NOT NULL,
    total_amount_lkr NUMERIC NOT NULL,
    status TEXT DEFAULT 'Processing',
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC POLICIES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Grant schema & table permissions to anon & authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Products Policies (Public can read active products, Admin/Service can insert/update)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for products" ON public.products;
CREATE POLICY "Enable insert for products" ON public.products
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for products" ON public.products;
CREATE POLICY "Enable update for products" ON public.products
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete for products" ON public.products;
CREATE POLICY "Enable delete for products" ON public.products
    FOR DELETE USING (true);

-- Orders Policies
DROP POLICY IF EXISTS "Enable all access for orders" ON public.orders;
CREATE POLICY "Enable all access for orders" ON public.orders
    FOR ALL USING (true);

-- Reviews Policies
DROP POLICY IF EXISTS "Enable all access for reviews" ON public.reviews;
CREATE POLICY "Enable all access for reviews" ON public.reviews
    FOR ALL USING (true);

-- 5. STORAGE BUCKET FOR PRODUCT PHOTOS
-- Creates 'product-images' bucket with public access for high-res jewelry photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies to allow public read & upload
DROP POLICY IF EXISTS "Public Access to Product Images" ON storage.objects;
CREATE POLICY "Public Access to Product Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow Uploads to Product Images" ON storage.objects;
CREATE POLICY "Allow Uploads to Product Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow Updates to Product Images" ON storage.objects;
CREATE POLICY "Allow Updates to Product Images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow Deletes to Product Images" ON storage.objects;
CREATE POLICY "Allow Deletes to Product Images" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images');
