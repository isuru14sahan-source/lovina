import { Product } from '../types';

// Supabase Cloud Configuration
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://lovina-luxury.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'public-anon-key-lovina';

export const supabaseService = {
  // Fetch all non-deleted products from Supabase Cloud
  async getActiveProducts(allProducts: Product[]): Promise<Product[]> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?is_deleted=eq.false`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.log('Supabase offline, using local memory state');
    }
    return allProducts.filter((p) => !p.isDeleted);
  },

  // Soft delete product (set is_deleted = true)
  async softDeleteProduct(productId: string): Promise<boolean> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_deleted: true })
      });
      return res.ok;
    } catch {
      return true; // Fallback to local memory update
    }
  },

  // Restore soft deleted product (set is_deleted = false)
  async restoreProduct(productId: string): Promise<boolean> {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_deleted: false })
      });
      return res.ok;
    } catch {
      return true;
    }
  }
};
