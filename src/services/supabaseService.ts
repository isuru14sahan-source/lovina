import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, Order } from '../types';

// Data mapping helper: Database row -> TypeScript Product
const mapRowToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  sku: row.sku || '',
  category: row.category,
  categoryName: row.category_name || row.category,
  priceLKR: Number(row.price_lkr),
  discountPriceLKR: row.discount_price_lkr ? Number(row.discount_price_lkr) : undefined,
  rating: Number(row.rating || 5.0),
  reviewCount: Number(row.review_count || 0),
  description: row.description || '',
  details: Array.isArray(row.details) ? row.details : [],
  attributes: row.attributes || {
    material: '18K Gold Plated',
    gemstone: 'Cubic Zirconia',
    plating: '18K Micro Gold Vacuum Plating',
    warranty: '1 Year Anti-Tarnish Warranty'
  },
  images: Array.isArray(row.images) ? row.images : ['/assets/necklace.jpg'],
  isFeatured: Boolean(row.is_featured),
  isNewArrival: Boolean(row.is_new_arrival),
  isBestSeller: Boolean(row.is_best_seller),
  variants: Array.isArray(row.variants) ? row.variants : [],
  stockQuantity: Number(row.stock_quantity || 10),
  isDeleted: Boolean(row.is_deleted)
});

// Data mapping helper: TypeScript Product -> Database row
const mapProductToRow = (p: Product) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  sku: p.sku,
  category: p.category,
  category_name: p.categoryName,
  price_lkr: p.priceLKR,
  discount_price_lkr: p.discountPriceLKR || null,
  rating: p.rating,
  review_count: p.reviewCount,
  description: p.description,
  details: p.details,
  attributes: p.attributes,
  images: p.images,
  is_featured: p.isFeatured || false,
  is_new_arrival: p.isNewArrival || false,
  is_best_seller: p.isBestSeller || false,
  variants: p.variants,
  stock_quantity: p.stockQuantity,
  is_deleted: p.isDeleted || false,
  updated_at: new Date().toISOString()
});

export const supabaseService = {
  // Check if Supabase connection is ready
  isReady(): boolean {
    return isSupabaseConfigured();
  },

  // Fetch all products from Supabase
  async getProducts(): Promise<Product[] | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getProducts error:', error);
        return null;
      }

      if (!data || data.length === 0) return [];
      return data.map(mapRowToProduct);
    } catch (err) {
      console.error('Failed to fetch products from Supabase:', err);
      return null;
    }
  },

  // Save / Insert new Product
  async createProduct(product: Product): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const row = mapProductToRow(product);
      const { error } = await supabase.from('products').insert([row]);

      if (error) {
        console.error('Supabase createProduct error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to create product in Supabase:', err);
      return false;
    }
  },

  // Update existing Product
  async updateProduct(product: Product): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const row = mapProductToRow(product);
      const { error } = await supabase
        .from('products')
        .update(row)
        .eq('id', product.id);

      if (error) {
        console.error('Supabase updateProduct error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to update product in Supabase:', err);
      return false;
    }
  },

  // Soft delete product
  async softDeleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  // Restore product
  async restoreProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_deleted: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  // Batch seed mock data into Supabase if empty
  async seedProducts(products: Product[]): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const rows = products.map(mapProductToRow);
      const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });

      if (error) {
        console.error('Error seeding products to Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed seeding products:', err);
      return false;
    }
  },

  // Upload Photo to Supabase Storage Bucket ('product-images')
  async uploadImage(file: File): Promise<string | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured yet. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `jewelry-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase storage upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      console.error('Failed to upload image to Supabase:', err);
      throw err;
    }
  },

  // Upload Video (MP4 / WebM) to Supabase Storage Bucket ('product-images')
  async uploadHeroVideo(file: File): Promise<string | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured yet. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    try {
      const fileExt = file.name.split('.').pop() || 'mp4';
      const rand = Math.random().toString(36).substring(2, 7);
      const fileName = `hero-video-${Date.now()}-${rand}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'video/mp4'
        });

      if (uploadError) {
        console.error('Supabase video upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err: any) {
      console.error('Failed to upload video to Supabase:', err);
      throw err;
    }
  },

  // Upload multiple hero videos in sequence or parallel with progress tracking
  async uploadMultipleHeroVideos(
    files: File[],
    onProgress?: (completed: number, total: number, currentName: string) => void
  ): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (onProgress) {
        onProgress(i, files.length, file.name);
      }
      const url = await this.uploadHeroVideo(file);
      if (url) {
        urls.push(url);
      }
      if (onProgress) {
        onProgress(i + 1, files.length, file.name);
      }
    }
    return urls;
  },

  // Fetch all orders from Supabase (for Admin & Dashboard)
  async getOrders(): Promise<Order[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) {
        console.error('Supabase getOrders error:', error);
        return [];
      }

      return data.map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        date: o.date,
        items: o.items,
        shippingAddress: o.shipping_address,
        paymentMethod: o.payment_method,
        totalAmountLKR: Number(o.total_amount_lkr),
        status: o.status,
        trackingNumber: o.tracking_number
      }));
    } catch (err) {
      console.error('Failed to fetch orders from Supabase:', err);
      return [];
    }
  },

  // Save new order to Supabase
  async createOrder(order: Order): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase.from('orders').insert([{
        id: order.id,
        order_number: order.orderNumber,
        date: order.date,
        items: order.items,
        shipping_address: order.shippingAddress,
        payment_method: order.paymentMethod,
        total_amount_lkr: order.totalAmountLKR,
        status: order.status,
        tracking_number: order.trackingNumber
      }]);

      if (error) {
        console.error('Supabase createOrder error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to save order to Supabase:', err);
      return false;
    }
  },

  // Update order status in Supabase
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Supabase updateOrderStatus error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to update order status in Supabase:', err);
      return false;
    }
  },

  // Seed initial orders into Supabase
  async seedOrders(orders: Order[]): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const rows = orders.map((o) => ({
        id: o.id,
        order_number: o.orderNumber,
        date: o.date,
        items: o.items,
        shipping_address: o.shippingAddress,
        payment_method: o.paymentMethod,
        total_amount_lkr: o.totalAmountLKR,
        status: o.status,
        tracking_number: o.trackingNumber
      }));

      const { error } = await supabase.from('orders').upsert(rows, { onConflict: 'id' });
      return !error;
    } catch (err) {
      console.error('Failed seeding orders to Supabase:', err);
      return false;
    }
  },

  // Track order from Supabase
  async trackOrder(query: string): Promise<Order | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const cleanQ = query.trim();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.ilike.${cleanQ},tracking_number.ilike.${cleanQ}`)
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        orderNumber: data.order_number,
        date: data.date,
        items: data.items,
        shippingAddress: data.shipping_address,
        paymentMethod: data.payment_method,
        totalAmountLKR: Number(data.total_amount_lkr),
        status: data.status,
        trackingNumber: data.tracking_number
      };
    } catch {
      return null;
    }
  }
};
